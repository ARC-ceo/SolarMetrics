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
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: "Geração (W)",
                data: [5, 15, 10, 20, 25],
                borderColor: "yellow",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
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


    fetch('http://192.168.15.31:1880/consumo')
        .then(response => response.json())
        .then(data => {
            currentConsumption = data.consumo; // Atualiza a umidade
        })
        .catch(error => console.error('Erro ao obter umidade:', error));

    fetch('http://192.168.15.31:1880/geracao')
        .then(response => response.json())
        .then(data => {
            currentGeneration = data.geracao; // Atualiza a pressão
        })
        .catch(error => console.error('Erro ao obter pressão:', error));

// Adiciona novos dados ao gráfico
realTimeChart.data.labels.push(new Date().toLocaleTimeString());
realTimeChart.data.datasets[0].data.push(currentConsumption);
realTimeChart.data.datasets[1].data.push(currentGeneration);

// Sobrescreve o primeiro valor quando o gráfico ultrapassa 10 pontos
if (realTimeChart.data.labels.length > 10) {
    // Substitui o primeiro valor (índice 0) pelos novos dados
    realTimeChart.data.labels[0] = new Date().toLocaleTimeString();
    realTimeChart.data.datasets[0].data[0] = currentConsumption;
    realTimeChart.data.datasets[1].data[0] = currentGeneration;
    
    // Move todos os outros valores para a esquerda
    for (let i = 1; i < realTimeChart.data.labels.length; i++) {
        realTimeChart.data.labels[i - 1] = realTimeChart.data.labels[i];
        realTimeChart.data.datasets[0].data[i - 1] = realTimeChart.data.datasets[0].data[i];
        realTimeChart.data.datasets[1].data[i - 1] = realTimeChart.data.datasets[1].data[i];
    }
}

// Atualiza o gráfico após a modificação
realTimeChart.update();

    realTimeChart.update();

    // Atualiza o gráfico de Aproveitamento do Sistema
    updateGaugeChart(currentGeneration, currentConsumption);
}, 1000);

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
function updateGaugeChart() {
    fetch('http://192.168.15.31:1880/porcentagem')
        .then(response => response.json())
        .then(data => {
            currentPorcentagem = data.porcentagem; // Atualiza a pressão
        })
        .catch(error => console.error('Erro ao obter pressão:', error));
    const remainder = 100 - currentPorcentagem; // O restante é o complemento de 100%

    // Atualiza os dados do gráfico com a porcentagem de aproveitamento
    gaugeChart.data.datasets[0].data = [
        Math.min(currentPorcentagem, 100), // Limita o aproveitamento a 100%
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
    document.getElementById("gaugePercentage").textContent = `${Math.round(currentPorcentagem)}%`;
}
