const ct = require('../controllers/categoria');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem todas as categorias em ordem para listar no cardápio
    server.get('/categoria', async (req, res) => {
        const result = await ct.controllers().listarTodas(req);
        res.send(result);
    })

    // salva todas as informações da categoria na página "Cardápio"
    server.post('/categoria', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarDados(req);
        res.send(result);
    })


}