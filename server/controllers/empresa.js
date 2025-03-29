const AcessoDados = require("../db/acessodados");
const db = new AcessoDados();
const ReadCommandSql = require("../common/readCommandSql");
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require("../common/protecaoAcesso");
const Acesso = new UsuarioAcessoToken();

const controllers = () => {
  const obterDadosCompletos = async (req) => {
    try {
      var ComandoSql = await readCommandSql.retornaStringSql(
        "obterDadosCompletos",
        "empresa"
      );
      var result = await db.Query(ComandoSql);

      return {
        status: "success",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: "Falha ao obter dados da empresa.",
      };
    }
  };

  const salvarDadosSobre = async (req) => {
    try {
      // obtem o id da empresa logada
      let _empresaId = Acesso.retornaCodigoTokenAcesso("IdEmpresa", req);

      req.body.idempresa = _empresaId;

      var ComandoSql = await readCommandSql.retornaStringSql(
        "salvarDadosSobre",
        "empresa"
      );
      var result = await db.Query(ComandoSql, req.body);

      return {
        status: "success",
        message: "Dados atualizados com sucesso!",
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: "Falha ao atualizar dados. Tente novamente.",
      };
    }
  };

  return Object.create({
    obterDadosCompletos,
    salvarDadosSobre,
  });
};

module.exports = Object.assign({ controllers });
