const AcessoDados = require("../db/acessodados");
const db = new AcessoDados();
const ReadCommandSql = require("../common/readCommandSql");
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require("../common/protecaoAcesso");
const Acesso = new UsuarioAcessoToken();

const controllers = () => {
  const listarTodas = async (req) => {
    try {
      var ComandoSql = await readCommandSql.retornaStringSql(
        "listarTodas",
        "categoria"
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
        message: "Falha ao obter as categorias.",
      };
    }
  };

  const salvarDados = async (req) => {
    try {
      var idcategoria = req.body.idcategoria;

      if (idcategoria > 0) {
        // atualizar a categoria
        var ComandoSql = await readCommandSql.retornaStringSql(
          "atualizarCategoria",
          "categoria"
        );
        var result = await db.Query(ComandoSql, req.body);

        return {
          status: "success",
          message: "Categoria atualizada com sucesso!",
        };
      } else {
        // inserir uma nova categoria
        var ComandoSql = await readCommandSql.retornaStringSql(
          "adicionarCategoria",
          "categoria"
        );
        var result = await db.Query(ComandoSql, req.body);

        return {
          status: "success",
          message: "Categoria adicionada com sucesso!",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: "Falha ao salvar categoria. Tente novamente.",
      };
    }
  };

  return Object.create({
    listarTodas,
    salvarDados,
  });
};

module.exports = Object.assign({ controllers });
