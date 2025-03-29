const ct = require("../controllers/imagem");
const UsuarioAcessoToken = require("../common/protecaoAcesso");
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {
  // Faz o upload do logotipo na pasta
  server.post(
    "/image/logo/upload",
    Acesso.verificaTokenAcesso,
    async (req, res) => {
      const result = await ct.controllers().uploadLogo(req);
      res.send(result);
    }
  );

  // Remove o logotipo da pasta
  server.post(
    "/image/logo/remove",
    Acesso.verificaTokenAcesso,
    async (req, res) => {
      const result = await ct.controllers().removeLogo(req);
      res.send(result);
    }
  );
};
