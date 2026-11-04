
const votingData = {
    options: [
        { id: "morning", time: "08h - 10h", description: "Ideal para quem fica em casa pela manhã." },
        { id: "late-morning", time: "10h - 12h", description: "Horário mais votado até o momento." },
        { id: "afternoon", time: "14h - 16h", description: "Alternativa para o período da tarde." }
    ],
    results: [
        { label: "08h - 10h", value: 38 },
        { label: "10h - 12h", value: 47 },
        { label: "14h - 16h", value: 15 }
    ]
};

function render() {
    document.querySelector("#voteOptions").innerHTML = votingData.options.map((option) => `
        <label class="vote-option" for="${option.id}">
            <input id="${option.id}" name="collectionTime" type="radio" value="${option.time}">
            <span><strong>${option.time}</strong><small>${option.description}</small></span>
            <span class="radio-mark" aria-hidden="true"></span>
        </label>
    `).join("");

    document.querySelector("#voteResults").innerHTML = votingData.results.map((item) => `
        <div class="vote-row"><span>${item.label}</span><div class="progress" aria-label="${item.value}% dos votos"><span style="width:${item.value}%"></span></div><strong>${item.value}%</strong></div>
    `).join("");
}

document.querySelector("#voteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = document.querySelector("input[name='collectionTime']:checked");
    if (!selected) {
        document.querySelector("#formMessage").textContent = "Escolha um horário antes de confirmar.";
        return;
    }

    window.location.href = `confirmacao.html?horario=${encodeURIComponent(selected.value)}`;
});

render();
