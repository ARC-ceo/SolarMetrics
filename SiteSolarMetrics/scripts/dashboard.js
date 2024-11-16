// Variáveis globais para armazenar os valores atuais
let currentConsumption = 0; // Consumo atual
let currentGeneration = 0; // Geração atual

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenuButton = document.getElementById("toggleMenu");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    toggleMenuButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        mainContent.classList.toggle("expanded");
    });
});

// Inicializa o gráfico de Medição em Tempo Real
const realTimeCtx = document.getElementById("realTimeChart").getContext("2d");
const realTimeChart = new Chart(realTimeCtx, {
    type: "line",
    data: {
        labels: ["9:00", "9:15", "9:30", "9:45", "10:00"],
        datasets: [
            {
                label: "Consumo (W)",
                data: [10, 20, 15, 25, 30],
                borderColor: "orange",
                backgroundColor: "rgba(255,165,0,0.3)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Geração (W)",
                data: [5, 15, 10, 20, 25],
                borderColor: "lime",
                backgroundColor: "rgba(0,255,0,0.3)",
                fill: true,
                tension: 0.4,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#fff",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#fff",
                },
            },
            y: {
                ticks: {
                    color: "#fff",
                },
            },
        },
    },
});

// Atualiza o gráfico de Medição em Tempo Real a cada 5 segundos
setInterval(() => {
    const newConsumption = Math.floor(Math.random() * 50) + 10; // Consumo aleatório
    const newGeneration = Math.floor(Math.random() * 50); // Geração aleatória

    // Atualiza as variáveis globais
    currentConsumption = newConsumption;
    currentGeneration = newGeneration;

    // Adiciona novos dados ao gráfico
    realTimeChart.data.labels.push(new Date().toLocaleTimeString());
    realTimeChart.data.datasets[0].data.push(currentConsumption);
    realTimeChart.data.datasets[1].data.push(currentGeneration);

    // Remove dados antigos para manter 10 pontos no gráfico
    if (realTimeChart.data.labels.length > 10) {
        realTimeChart.data.labels.shift();
        realTimeChart.data.datasets[0].data.shift();
        realTimeChart.data.datasets[1].data.shift();
    }

    realTimeChart.update();

    // Atualiza o gráfico de Aproveitamento do Sistema
    updateGaugeChart(currentGeneration, currentConsumption);
}, 5000);

// Inicializa o gráfico de Aproveitamento do Sistema
const gaugeChart = new Chart(document.getElementById("gaugeChart"), {
    type: "doughnut",
    data: {
        labels: ["Aproveitamento", "Resto"],
        datasets: [
            {
                data: [50, 50], // Valores iniciais
                backgroundColor: ["#e1e417", "#333"], // Cores iniciais
                borderWidth: 0,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: 0, // Define para exibir o círculo completo
        circumference: 360, // Mostra o círculo inteiro
        cutout: "70%", // Define o espaço interno
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    },
});

// Função para calcular e atualizar o gráfico de Aproveitamento
function updateGaugeChart(generation, consumption) {
    const utilization = consumption > 0 ? (generation / consumption) * 100 : 0; // Calcula o aproveitamento
    const remainder = 100 - utilization;

    // Atualiza os dados do gráfico
    gaugeChart.data.datasets[0].data = [
        Math.min(utilization, 100), // Limita o aproveitamento a 100%
        Math.max(remainder, 0), // Garante que o restante não seja negativo
    ];

    // Atualiza a cor do gráfico
    gaugeChart.data.datasets[0].backgroundColor = [
        "#e1e417", // Parte amarela (aproveitamento)
        "#333", // Parte cinza (resto)
    ];

    // Atualiza o gráfico
    gaugeChart.update();

    // Exibe o percentual no centro do gráfico
    document.getElementById("gaugePercentage").textContent = `${Math.round(
        Math.min(utilization, 100)
    )}%`;
}