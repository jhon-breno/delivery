const ct = require("../controllers/empresa");
const UsuarioAcessoToken = require("../common/protecaoAcesso");
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {
  // obtem todas as informações da empresa para exibir na página "Sobre"
  server.get("/empresa/sobre", async (req, res) => {
    const result = await ct.controllers().obterDadosCompletos(req);
    res.send(result);
  });

  // salva todas as informações da empresa na página "Sobre"
  server.post(
    "/empresa/sobre",
    Acesso.verificaTokenAcesso,
    async (req, res) => {
      const result = await ct.controllers().salvarDadosSobre(req);
      res.send(result);
    }
  );
};
