function toggleAnswer(index) {
    const answer = document.getElementById(`answer-${index}`);
    const questionBox = document.querySelectorAll('.faq-item')[index]; 

    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        questionBox.style.backgroundColor = '#333';
        questionBox.style.boxShadow = 'none';
    } else {
        answer.style.display = 'block';
        questionBox.style.backgroundColor = '#7a7909bd'; 
        questionBox.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const usernameField = document.getElementById("uname");
    const passwordField = document.getElementById("psw");
    const rememberCheckbox = document.getElementById("remember-checkbox");

    // Carrega dados armazenados, se houver
    if (localStorage.getItem("username")) {
        usernameField.value = localStorage.getItem("username");
        passwordField.value = localStorage.getItem("password");
        rememberCheckbox.checked = true; // Marca a checkbox se os dados estiverem salvos
    }

    // Salva dados no Local Storage apenas se a checkbox estiver marcada
    const form = document.getElementById("login-form");
    form.addEventListener("submit", function () {
        if (rememberCheckbox.checked) {
            localStorage.setItem("username", usernameField.value);
            localStorage.setItem("password", passwordField.value);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const cadastroTab = document.getElementById("cadastroTab");
    const loginForm = document.getElementById("loginForm");
    const cadastroForm = document.getElementById("cadastroForm");

    // Função para alternar entre os formulários
    const alternarFormularios = (ativarLogin) => {
        if (ativarLogin) {
            loginForm.style.display = "block";
            loginForm.style.opacity = "1"; // Para transição suave
            cadastroForm.style.display = "none";
            cadastroForm.style.opacity = "0";
        } else {
            cadastroForm.style.display = "block";
            cadastroForm.style.opacity = "1"; // Para transição suave
            loginForm.style.display = "none";
            loginForm.style.opacity = "0";
        }
    };

    // Evento para exibir o formulário de login
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("ativo");
        cadastroTab.classList.remove("ativo");
        alternarFormularios(true); // Ativar login
    });

    // Evento para exibir o formulário de cadastro
    cadastroTab.addEventListener("click", () => {
        cadastroTab.classList.add("ativo");
        loginTab.classList.remove("ativo");
        alternarFormularios(false); // Ativar cadastro
    });

    // Exibe o formulário inicial
    alternarFormularios(true);
});