const API_URL = "http://localhost:3000/api";
const form = document.querySelector("#registerForm");
const message = document.querySelector("#formMessage");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const resposta = await fetch(API_URL + "/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const resultado = await resposta.json();
    if (!resposta.ok) { message.textContent = resultado.error || "Não foi possível concluir o cadastro."; return; }
    localStorage.setItem("usuarioId", resultado.id);
    localStorage.setItem("usuarioNome", resultado.nome);
    message.textContent = "Cadastro realizado. Você será direcionado para a votação.";
    setTimeout(() => { window.location.href = "votacao.html"; }, 900);
});
