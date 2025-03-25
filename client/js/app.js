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
              // Se o retorno for não autorizado, redireciona para a tela de login
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
              // Se o retorno for não autorizado, redireciona para a tela de login
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

  // grava valor no localstorage
  gravarValorStorage: (valor, local) => {
    localStorage[local] = valor;
  },

  // obtém valor do localstorage
  obterValorStorage: (local) => {
    return localStorage[local];
  },

  // metodo que limpa o localstorage e redireciona para a tela de login
  logout: () => {
    localStorage.clear();
    window.location.href = "/painel/login.html";
  },

  // método genérico para exibir mensagens
  mensagem: (texto, cor = "red", tempo = 3500) => {
    let container = document.querySelector("#container-mensagens");

    if (container.childElementCount > 2) {
      return;
    }

    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id='msg-${id}' class="toast ${cor}">${texto}</div>`;

    container.innerHTML += msg;

    setTimeout(() => {
      document.querySelector(`#msg-${id}`).remove();
    }, tempo);
  },
};
