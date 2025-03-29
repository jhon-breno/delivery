var app = {};

app.event = {};

app.method = {
  // centraliza as chamadas de GET
  get: (url, callbackSuccess, callbackError, login = false) => {
    try {
      if (app.method.validaToken(login)) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader(
          "Authorization",
          app.method.obterValorStorage("token")
        );

        xhr.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              return callbackSuccess(JSON.parse(xhr.responseText));
            } else {
              // se o retorno for não autorizado, redireciona o usuário para o login
              if (xhr.status == 401) {
                app.method.logout();
              }

              return callbackError(xhr.responseText);
            }
          }
        };

        xhr.send();
      }
    } catch (error) {
      return callbackError(error);
    }
  },

  // centraliza as chamadas de POST
  post: (url, dados, callbackSuccess, callbackError, login = false) => {
    try {
      if (app.method.validaToken(login)) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader(
          "Authorization",
          app.method.obterValorStorage("token")
        );

        xhr.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              return callbackSuccess(JSON.parse(xhr.responseText));
            } else {
              // se o retorno for não autorizado, redireciona o usuário para o login
              if (xhr.status == 401) {
                app.method.logout();
              }

              return callbackError(xhr.responseText);
            }
          }
        };

        xhr.send(dados);
      }
    } catch (error) {
      return callbackError(error);
    }
  },

  // centraliza as chamadas de UPLOAD
  upload: (url, dados, callbackSuccess, callbackError, login = false) => {
    try {
      if (app.method.validaToken(login)) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Mime-Type", "multipart/form-data");
        xhr.setRequestHeader(
          "Authorization",
          app.method.obterValorStorage("token")
        );

        xhr.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              return callbackSuccess(JSON.parse(xhr.responseText));
            } else {
              // se o retorno for não autorizado, redireciona o usuário para o login
              if (xhr.status == 401) {
                app.method.logout();
              }

              return callbackError(xhr.responseText);
            }
          }
        };

        xhr.send(dados);
      }
    } catch (error) {
      return callbackError(error);
    }
  },

  // método para validar se o token existe (local). É chamado em todas as requisições
  validaToken: (login = false) => {
    var tokenAtual = app.method.obterValorStorage("token");

    if (
      (tokenAtual == undefined ||
        tokenAtual == null ||
        tokenAtual == "" ||
        tokenAtual == "null") &&
      !login
    ) {
      window.location.href = "/painel/login.html";
      return false;
    }

    return true;
  },

  // grava valores no localstorage
  gravarValorStorage: (valor, local) => {
    localStorage[local] = valor;
  },

  // obtem um valor do localstorage
  obterValorStorage: (local) => {
    return localStorage[local];
  },

  // remove uma sessão
  removerSessao: (local) => {
    localStorage.removeItem(local);
  },

  // método que limpa todo o localstorage e redireciona pro login
  logout: () => {
    localStorage.clear();
    window.location.href = "/painel/login.html";
  },

  // método genérico para mensagens
  mensagem: (texto, cor = "red", tempo = 3500) => {
    let container = document.querySelector("#container-mensagens");

    if (container.childElementCount > 2) {
      return;
    }

    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="toast ${cor}">${texto}</div>`;

    container.innerHTML += msg;

    setTimeout(() => {
      document.querySelector(`#msg-${id}`).remove();
    }, tempo);
  },

  // método que exibe o loader
  loading: (running = false) => {
    if (running) {
      document.querySelector(".loader-full").classList.remove("hidden");
    } else {
      document.querySelector(".loader-full").classList.add("hidden");
    }
  },

  // carrega os dados da empresa
  carregarDadosEmpresa: () => {
    document.querySelector(".nome-empresa").innerHTML =
      app.method.obterValorStorage("Nome");
    document.querySelector(".email-empresa").innerHTML =
      app.method.obterValorStorage("Email");

    let logotipo = app.method.obterValorStorage("Logo");

    if (
      logotipo != undefined &&
      logotipo != null &&
      logotipo != "null" &&
      logotipo != ""
    ) {
      document.querySelector(".logo-empresa").src =
        "/public/images/empresa/" + logotipo;
    } else {
      document.querySelector(".logo-empresa").src =
        "/public/images/default.jpg";
    }
  },
};
