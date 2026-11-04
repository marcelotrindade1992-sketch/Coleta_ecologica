const params = new URLSearchParams(window.location.search);
const horario = params.get("horario");

if (horario) {
    document.querySelector("#confirmationText").textContent = `Você escolheu o horário ${horario}. Em produção, este voto seria enviado para a API e contabilizado para a região Rafael Alto.`;
}
