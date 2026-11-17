
const API_URL = "http://localhost:3000/api";

const searchButton = document.querySelector("#searchButton");
const message = document.querySelector("#consultaMessage");
const resultPanel = document.querySelector("#resultPanel");

// Formata o horário recebido do PostgreSQL
function horario(valor) {
    return valor ? valor.slice(0, 5) : "--:--";
}


function mostrarMensagem(texto, erro = false) {
    message.textContent = texto;
    message.classList.toggle("error-message", erro);
}


function criarCartao(opcao, votos, total) {

    const votosDaOpcao = votos.filter(
        (voto) =>
            Number(voto.opcao_enquete_id) === Number(opcao.id)
    );

    const quantidade = votosDaOpcao.length;

    const percentual = total === 0
        ? 0
        : Math.round((quantidade / total) * 100);

    const card = document.createElement("article");
    card.className = "result-card";

    // Cabeçalho
    const topo = document.createElement("div");
    topo.className = "result-card-top";

    const horarioElemento = document.createElement("span");
    horarioElemento.className = "result-time";
    horarioElemento.textContent =
        `${horario(opcao.horario_inicio)} - ${horario(opcao.horario_fim)}`;

    const quantidadeElemento = document.createElement("strong");
    quantidadeElemento.textContent =
        `${quantidade} voto(s)`;

    topo.append(horarioElemento, quantidadeElemento);

    // Descrição
    const descricao = document.createElement("p");
    descricao.textContent = opcao.descricao || "";

    // Barra de progresso
    const progresso = document.createElement("div");
    progresso.className = "result-progress";

    const percentualValor = document.createElement("span");
    percentualValor.style.width = `${percentual}%`;

    progresso.setAttribute(
        "aria-label",
        `${percentual}% dos votos`
    );

    progresso.appendChild(percentualValor);

    const percentualElemento = document.createElement("small");
    percentualElemento.textContent = `${percentual}% do total`;

    // Lista de moradores que votaram
    const tituloNomes = document.createElement("h3");
    tituloNomes.textContent = "Quem votou:";

    const listaNomes = document.createElement("ul");
    listaNomes.className = "voter-list";

    if (quantidade > 0) {

        votosDaOpcao.forEach((voto) => {

            const item = document.createElement("li");

            // Campo correto retornado pela sua API
            item.textContent =
                voto.usuario_nome || "Nome não informado";

            listaNomes.appendChild(item);
        });

    } else {

        const item = document.createElement("li");
        item.textContent = "Ainda não há votos para este horário.";

        listaNomes.appendChild(item);
    }

    // Montagem do cartão
    card.append(
        topo,
        descricao,
        progresso,
        percentualElemento,
        tituloNomes,
        listaNomes
    );

    return card;
}

// Busca os dados da votação na API
async function carregarConsulta() {

    searchButton.disabled = true;
    searchButton.textContent = "Buscando resultado...";

    mostrarMensagem("Consultando a API...");
    resultPanel.hidden = true;

    try {

        // Busca a enquete ativa
        const enquetesResposta = await fetch(
            `${API_URL}/enquetes?status=ativa`
        );

        if (!enquetesResposta.ok) {
            throw new Error("Não foi possível consultar as enquetes.");
        }

        const enquetes = await enquetesResposta.json();
        const enquete = enquetes[0];

        if (!enquete) {
            throw new Error(
                "Não há uma votação ativa neste momento."
            );
        }

        // Busca opções e votos
        const [opcoesResposta, votosResposta] = await Promise.all([

            fetch(
                `${API_URL}/enquetes/${enquete.id}/opcoes`
            ),

            fetch(
                `${API_URL}/votos?enquete_id=${enquete.id}`
            )

        ]);

        if (!opcoesResposta.ok || !votosResposta.ok) {
            throw new Error(
                "Não foi possível carregar os resultados."
            );
        }

        const opcoes = await opcoesResposta.json();
        const votos = await votosResposta.json();

        // Atualiza informações da enquete
        document.querySelector("#consultaTitulo").textContent =
            enquete.titulo;

        document.querySelector("#consultaDescription").textContent =
            `Região: ${enquete.regiao_nome}. ${enquete.descricao || ""}`;

        document.querySelector("#totalVotes").textContent =
            `${votos.length} ${votos.length === 1 ? "voto" : "votos"}`;

        // Renderiza os cartões
        const destino = document.querySelector("#consultaResults");

        destino.replaceChildren(
            ...opcoes.map((opcao) =>
                criarCartao(opcao, votos, votos.length)
            )
        );

        resultPanel.hidden = false;

        mostrarMensagem("Resultado atualizado com sucesso.");

    } catch (error) {

        console.error("Erro na consulta:", error);

        mostrarMensagem(
            error.message ||
            "Não foi possível buscar o resultado. Confira se a API está ligada.",
            true
        );

    } finally {

        searchButton.disabled = false;
        searchButton.textContent = "Atualizar resultado";

    }
}

// Evento do botão de consulta
searchButton.addEventListener("click", carregarConsulta);
