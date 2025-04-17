--INIT#listarTodas#

SELECT
    idcategoria, nome, icone
FROM
    categoria
WHERE
    apagado = 0
ORDER BY
    -ordem DESC, idcategoria ASC 

--END#listarTodas#


--INIT#atualizarCategoria#

UPDATE
    categoria
SET
    nome = @nome,
    icone = @icone
WHERE
    idcategoria = @idcategoria

--END#atualizarCategoria#


--INIT#adicionarCategoria#

INSERT INTO categoria
(nome, icone)
VALUES
(@nome, @icone)

--END#adicionarCategoria#