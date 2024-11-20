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

document.addEventListener("DOMContentLoaded", () => {
    const settingsButton = document.getElementById("settings");
    const overviewSection = document.getElementById("mainContent");
    const settingsSection = document.getElementById("settingsSection");
    const returnButton = document.getElementById("returnToOverview");
    const overviewButton = document.getElementById("overview");

    // Alternar para Configurações
    settingsButton.addEventListener("click", () => {
        overviewSection.classList.remove("active");
        overviewSection.style.display = "none";
        settingsSection.classList.add("active");
        settingsSection.style.display = "block";
    });

    // Retornar ao Overview
    returnButton.addEventListener("click", () => {
        settingsSection.classList.remove("active");
        settingsSection.style.display = "none";
        overviewSection.classList.add("active");
        overviewSection.style.display = "block";
    });

    // Botão Overview
    overviewButton.addEventListener("click", () => {
        settingsSection.classList.remove("active");
        settingsSection.style.display = "none";
        overviewSection.classList.add("active");
        overviewSection.style.display = "block";
    });
});

// Inicializa o gráfico de Medição em Tempo Real
const realTimeCtx = document.getElementById("realTimeChart").getContext("2d");
const realTimeChart = new Chart(realTimeCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Consumo (W)",
                data: [],
                borderColor: "orange",               
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: "Geração (W)",
                data: [],
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
                    color: 'rgba(255, 255, 255, 0.4)',

                },
                
                
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Desativa a grade do eixo x
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)', // Opacidade de 50% para as labels do eixo X
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    lineWidth: 1,  // Espessura das linhas da grade do eixo y
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                },
            },
        },
        backgroundColor: 'rgba(0, 0, 0, 0)', // Define o fundo do gráfico como transparente
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
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
realTimeChart.data.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
realTimeChart.data.datasets[0].data.push(currentConsumption);
realTimeChart.data.datasets[1].data.push(currentGeneration);

// Sobrescreve o primeiro valor quando o gráfico ultrapassa 10 pontos
if (realTimeChart.data.labels.length > 5) {
    // Substitui o primeiro valor (índice 0) pelos novos dados
    realTimeChart.data.labels[0] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
realTimeChart.update({
    duration: 0 // Desativa a animação
});

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

// Menu Ativo
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            menuItems.forEach((el) => el.classList.remove("ativo"));
            item.classList.add("ativo");
        });
    });

    document.getElementById("settings").addEventListener("click", () => {
        document.getElementById("mainContent").classList.remove("active");
        document.getElementById("settingsSection").classList.add("active");
    });

    document.getElementById("returnToOverview").addEventListener("click", () => {
        document.getElementById("settingsSection").classList.remove("active");
        document.getElementById("mainContent").classList.add("active");
    });
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
