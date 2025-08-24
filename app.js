class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if (this[i] === undefined || this[i] === "" || this[i] === null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem("id")

        if (id === null) {
            localStorage.setItem("id", 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem("id")
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem("id", id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem("id")

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisarRegistros(despesa) {
        let despesas = this.recuperarTodosRegistros()
        return despesas.filter(d => {
            for (let key in despesa) {
                if (despesa[key] !== "" && despesa[key] !== undefined) {
                    if (d[key] !== despesa[key]) {
                        return false
                    }
                }
            }
            return true
        })
    }

    removerRegistro(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function getDadosDespesa() {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    return new Despesa(
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor
    )
}

function cadastrarDespesa() {
    let despesa = getDadosDespesa()

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso"
        document.getElementById("modal_conteudo").innerHTML = "Despesa foi cadastrada com sucesso!"
        document.getElementById("modal_titulo_div").className = "modal-header text-success"
        document.getElementById("botao_modal").innerHTML = "Voltar"
        document.getElementById("botao_modal").className = "btn btn-success"
        $('#modalRegistraDespesa').modal('show')

        $('#modalRegistraDespesa').on('hidden.bs.modal', function () {
            location.reload()
        })
    } else {
        document.getElementById("modal_titulo").innerHTML = "Erro na inclusão do registro"
        document.getElementById("modal_conteudo").innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos corretamente."
        document.getElementById("modal_titulo_div").className = "modal-header text-danger"
        document.getElementById("botao_modal").innerHTML = "Voltar e corrigir"
        document.getElementById("botao_modal").className = "btn btn-danger"
        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length === 0 && !filtro) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ""

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case "1":
                d.tipo = "Alimentação"
                break
            case "2":
                d.tipo = "Educação"
                break
            case "3":
                d.tipo = "Lazer"
                break
            case "4":
                d.tipo = "Saúde"
                break
            case "5":
                d.tipo = "Transporte"
                break
        }
        
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = "Excluir"
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            let id = this.id.replace("id_despesa_", "")
            bd.removerRegistro(id)
            carregaListaDespesas()
        }
        linha.insertCell(4).appendChild(btn)
    })
}

function pesquisarDespesa() {
    let despesa = getDadosDespesa()

    let despesas = bd.pesquisarRegistros(despesa)
    this.carregaListaDespesas(despesas, true)
}
