
const API_URL = "http://localhost:3000/api";
const USUARIO_DEMONSTRACAO_ID =
    Number(localStorage.getItem("usuarioId")) || 1;

let enquete;
let opcoes = [];
let votoAtual;

function horario(valor) {
    return valor ? valor.slice(0, 5) : "";
}

function mensagem(texto) {
    document.querySelector("#formMessage").textContent = texto;
}

function renderizarOpcoes() {
    const container = document.querySelector("#voteOptions");

    container.innerHTML = opcoes.map((opcao) => `
        <label class="vote-option" for="opcao-${opcao.id}">
            <input
                id="opcao-${opcao.id}"
                name="collectionTime"
                type="radio"
                value="${opcao.id}"
                ${Number(votoAtual?.opcao_enquete_id) === Number(opcao.id) ? "checked" : ""}
            >

            <span>
                <strong>
                    ${horario(opcao.horario_inicio)} -
                    ${horario(opcao.horario_fim)}
                </strong>
                <small>${opcao.descricao || ""}</small>
            </span>

            <span class="radio-mark" aria-hidden="true"></span>
        </label>
    `).join("");
}

async function carregarVotacao() {
    try {
        mensagem("Carregando votação...");

        const respostaEnquetes = await fetch(
            `${API_URL}/enquetes?status=ativa`
        );

        if (!respostaEnquetes.ok) {
            throw new Error("Não foi possível buscar as enquetes.");
        }

        const enquetes = await respostaEnquetes.json();

        enquete = enquetes[0];

        if (!enquete) {
            throw new Error("Não há enquete ativa neste momento.");
        }

        const [respostaOpcoes, respostaVotos] = await Promise.all([
            fetch(`${API_URL}/enquetes/${enquete.id}/opcoes`),
            fetch(`${API_URL}/votos?enquete_id=${enquete.id}`)
        ]);

        if (!respostaOpcoes.ok || !respostaVotos.ok) {
            throw new Error("Não foi possível carregar os dados da votação.");
        }

        opcoes = await respostaOpcoes.json();

        const votos = await respostaVotos.json();

        votoAtual = votos.find(
            (voto) =>
                Number(voto.usuario_id) === USUARIO_DEMONSTRACAO_ID
        );

        document.querySelector("#pergunta-titulo").textContent =
            enquete.titulo;

        document.querySelector("#voteDescription").textContent =
            `Região: ${enquete.regiao_nome}. ${enquete.descricao || ""}`;

        document.querySelector("#voteButton").textContent =
            votoAtual ? "Atualizar voto" : "Confirmar voto";

        renderizarOpcoes();

        mensagem("");

    } catch (erro) {
        console.error("Erro ao carregar votação:", erro);

        mensagem(
            erro.message ||
            "Não foi possível carregar a votação. Confira se a API está ligada."
        );
    }
}

document.querySelector("#voteForm").addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        if (!enquete) {
            mensagem("Não há uma enquete disponível.");
            return;
        }

        const selecionada = document.querySelector(
            "input[name='collectionTime']:checked"
        );

        if (!selecionada) {
            mensagem("Escolha um horário antes de confirmar.");
            return;
        }

        const botao = document.querySelector("#voteButton");

        const dados = {
            enquete_id: enquete.id,
            opcao_enquete_id: Number(selecionada.value),
            usuario_id: USUARIO_DEMONSTRACAO_ID
        };

        const url = votoAtual
            ? `${API_URL}/votos/${votoAtual.id}`
            : `${API_URL}/votos`;

        try {
            botao.disabled = true;
            mensagem("Enviando seu voto...");

            const resposta = await fetch(url, {
                method: votoAtual ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    votoAtual
                        ? { opcao_enquete_id: dados.opcao_enquete_id }
                        : dados
                )
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error || "Não foi possível registrar o voto."
                );
            }

            mensagem(
                votoAtual
                    ? "Voto atualizado com sucesso."
                    : "Voto registrado com sucesso."
            );

            await carregarVotacao();

        } catch (erro) {
            console.error("Erro ao registrar voto:", erro);

            mensagem(
                erro.message || "Erro ao comunicar com o servidor."
            );

        } finally {
            botao.disabled = false;
        }
    }
);

carregarVotacao();
