/* Dados demonstrativos. Em uma próxima etapa, poderão vir de uma API Node.js. */
const dashboardData = {
    summary: [
        { icon: "◉", label: "Votos registrados", value: "248", detail: "+18 nesta semana" },
        { icon: "♻", label: "Moradores ativos", value: "86", detail: "na região Rafael Alto" },
        { icon: "▣", label: "Próxima coleta", value: "18 OUT", detail: "sábado, a partir das 08h" },
        { icon: "✓", label: "Seu voto", value: "Enviado", detail: "horário: 10h" }
    ],
    votes: [ { label: "08h - 10h", value: 38 }, { label: "10h - 12h", value: 47 }, { label: "14h - 16h", value: 15 } ],
    schedule: [
        { day: "18", month: "OUT", title: "Coleta seletiva", description: "Plástico, papel e metal - a partir das 08h", type: "green" },
        { day: "22", month: "OUT", title: "Resíduos orgânicos", description: "Coleta domiciliar - a partir das 07h", type: "" },
        { day: "25", month: "OUT", title: "Coleta seletiva", description: "Vidro e eletrônicos - a partir das 08h", type: "blue" }
    ]
};
function render() {
    document.querySelector("#summaryCards").innerHTML = dashboardData.summary.map((item) => `<article class="summary-card"><span class="summary-icon" aria-hidden="true">${item.icon}</span><h3>${item.label}</h3><div class="summary-value">${item.value}</div><p class="summary-detail">${item.detail}</p></article>`).join("");
    document.querySelector("#voteResults").innerHTML = dashboardData.votes.map((item) => `<div class="vote-row"><span>${item.label}</span><div class="progress" aria-label="${item.value}% dos votos"><span style="width:${item.value}%"></span></div><strong>${item.value}%</strong></div>`).join("");
    document.querySelector("#scheduleList").innerHTML = dashboardData.schedule.map((item) => `<article class="schedule-item"><div class="date-box"><strong>${item.day}</strong><span>${item.month}</span></div><div><h3>${item.title}</h3><p>${item.description}</p></div><span class="material-dot ${item.type}" aria-hidden="true"></span></article>`).join("");
}
render();
