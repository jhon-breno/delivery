$(document).ready(function () {
    cardapio.event.init();
});

var cardapio = {};

var CATEGORIAS = [];

var CATEGORIA_ID = 0;

cardapio.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        cardapio.method.obterCategorias();
        cardapio.method.carregarListaIcones();

    }

}

cardapio.method = {

    // obtem a lista de categorias
    obterCategorias: () => {

        app.method.loading(true);
        $("#categoriasMenu").html('');

        CATEGORIAS = [];

        app.method.get('/categoria',
            (response) => {

                console.log(response)
                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                CATEGORIAS = response.data;

                cardapio.method.carregarCategorias(response.data);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // carrega as categorias na tela
    carregarCategorias: (lista) => {

        if (lista.length > 0) {

            lista.forEach((e, i) => {

                let icone = ICONES.filter((elem) => { return elem.name === e.icone })

                let temp = cardapio.template.categoria.replace(/\${id}/g, e.idcategoria)
                    .replace(/\${icone}/g, icone[0].icon)
                    .replace(/\${titulo}/g, e.nome)

                $("#categoriasMenu").append(temp);

                // último item, inicia o evento de tooltip
                if ((i + 1) == lista.length) {
                    $('[data-toggle="tooltip"]').tooltip();
                }

            });

        }

    },

    // carrega a lista de icones da categoria (modal de cadastro)
    carregarListaIcones: () => {

        $.each(ICONES, (i, e) => {
            $("#ddlIconeCategoria").append(`<option value="${e.name}">${e.unicode}</option>`)
        })

    },

    // método para abrir a modal de adicionar nova categoria
    abrirModalAdicionarCategoria: () => {

        CATEGORIA_ID = 0;

        // limpa os campos
        $("#ddlIconeCategoria").val('-1');
        $("#txtNomeCategoria").val('');

        // abre a modal
        $("#modalCategoria").modal({ backdrop: 'static' });
        $("#modalCategoria").modal('show');

    },

    // abre a modal para duplicar a categoria
    abrirModalDuplicarCategoria: () => {

    },

    // abre a modal para remover a categoria
    abrirModalRemoverCategoria: () => {

    },

    // abre a modal de edição de categoria
    editarCategoria: (idcategoria) => {

        CATEGORIA_ID = idcategoria;

        let categoria = CATEGORIAS.filter((e) => { return e.idcategoria == idcategoria });

        if (categoria.length > 0) {

            // altera os campos da modal
            $("#ddlIconeCategoria").val(categoria[0].icone);
            $("#txtNomeCategoria").val(categoria[0].nome);

            // abre a modal
            $("#modalCategoria").modal({ backdrop: 'static' });
            $("#modalCategoria").modal('show');

        }

    },

    // método para confirmar o cadastro / edição da categoria
    salvarCategoria: () => {

        // valida os campos

        let icone = $("#ddlIconeCategoria").val();
        let nome = $("#txtNomeCategoria").val().trim();

        if (icone == "-1") {
            app.method.mensagem('Selecione o ícone da categoria, por favor.')
            return;
        }

        if (nome.length <= 0) {
            app.method.mensagem('Infrome o nome da categoria, por favor.')
            return;
        }

        let dados = {
            icone: icone,
            nome: nome,
            idcategoria: CATEGORIA_ID
        }

        app.method.loading(true);

        app.method.post('/categoria', JSON.stringify(dados),
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                $("#modalCategoria").modal('hide')

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');
                cardapio.method.obterCategorias();
                
            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

}

cardapio.template = {

    categoria: `
        <div class="card mt-3" data-idcategoria="\${id}">
            <div class="card-drag" id="heading-\${id}">
                <div class="drag-icon">
                    <i class="fas fa-ellipsis-v"></i>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
                <div class="infos">
                    <a href="#!" class="name mb-0" data-bs-toggle="collapse" data-bs-target="#collapse-\${id}" aria-expanded="true" aria-controls="collapse-\${id}">
                        <span class="me-2">\${icone}</span>
                        <b>\${titulo}</b>
                    </a>
                </div>
                <div class="actions">
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Editar" onclick="cardapio.method.editarCategoria('\${id}')">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Duplicar" onclick="cardapio.method.abrirModalDuplicarCategoria('\${id}')">
                        <i class="far fa-copy"></i>
                    </a>
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Remover" onclick="cardapio.method.abrirModalRemoverCategoria('\${id}')">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
            </div>

            <div id="collapse-\${id}" class="collapse" data-parent="#categoriasMenu">
                <div class="card-body">

                    <p class="title-produtos mb-0"><b>Produtos</b></p>

                    <div class="lista-produtos" id="listaProdutos-\${id}">

                    </div>

                    <div class="card card-select mt-3" onclick="cardapio.method.abrirModalAdicionarProduto('\${id}')">
                        <div class="infos-produto-opcional">
                            <p class="mb-0 color-primary">
                                <i class="fas fa-plus-circle"></i>&nbsp; Adicionar novo produto
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    `,

    produto: `
        <div class="card mt-3 pl-0">
            <div class="d-flex">
                <div class="drag-icon-produto">
                    <i class="fas fa-ellipsis-v"></i>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
                <div class="container-img-produto" style="background-image: url('../img/calabresa.jpg'); background-size: cover;">
                    <a href="#" class="icon-action me-1 mb-1">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                </div>
                <div class="infos-produto">
                    <p class="name"><b>Calabresa</b></p>
                    <p class="description">Molho de tomate, mussarela, cebola, calabresa, catupiry, tomate, orégano e azeitonas</p>
                    <p class="price"><b>R$ 39,90</b></p>
                </div>
                <div class="actions">
                    <a href="#" class="icon-action">
                        <span class="badge-adicionais">2</span>
                        <i class="fas fa-layer-group"></i>
                    </a>
                    <a href="#" class="icon-action">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                    <a href="#" class="icon-action">
                        <i class="far fa-copy"></i>
                    </a>
                    <a href="#" class="icon-action">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    `

}