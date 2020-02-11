let novoBtn, limparBtn, autocompletarBtn, jogarBtn
let bingoEl

const EMPTY_NUMBER = -1

let cols = 5
let rows = 5
let colName = ['B', 'I', 'N', 'G', 'O']
let modo // 1 = completar / 2 = jogar
let numeros
let numerosElementos
let numerosSelecionados

window.onload = inicializar

function inicializar() {
    bingoEl = document.querySelector('#bingo')
    novoBtn = document.querySelector('#novoBtn')
    limparBtn = document.querySelector('#limparBtn')
    autocompletarBtn = document.querySelector('#autocompletarBtn')
    jogarBtn = document.querySelector('#jogarBtn')

    novoBtn.addEventListener('click', novoBtnHandle)
    limparBtn.addEventListener('click', limparBtnHandle)
    autocompletarBtn.addEventListener('click', autocompletarBtnHandle)
    jogarBtn.addEventListener('click', jogarBtnHandle)

    criarElementosBingo()
    novoJogo()
}

function atualizarBotoes() {
    switch (modo) {
        case 0:
            novoBtn.disabled = false
            limparBtn.disabled = true
            autocompletarBtn.disabled = true
            jogarBtn.disabled = true
            return

        case 1:
            novoBtn.disabled = true
            limparBtn.disabled = false
            autocompletarBtn.disabled = false
            jogarBtn.disabled = false
            return

        case 2:
            novoBtn.disabled = false
            limparBtn.disabled = true
            autocompletarBtn.disabled = true
            jogarBtn.disabled = true
            return
    }
}

function autocompletarBtnHandle() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row == 2 && col == 2) {
                continue
            }

            if (numeros[row][col] == EMPTY_NUMBER) {
                numerosElementos[row][col].value = setNumeroAleatorio(row, col)
            }
        }
    }
}

function calcularK(row, col) {
    return (rows * col) + row
}

function colMax(col) {
    return (col + 1) * 15
}

function colMin(col) {
    return (col * 15) + 1
}

function criarElementosBingo() {
    let el

    numerosElementos = []
    for (let row = 0; row < rows; row++) {
        numerosElementos[row] = []

        for (let col = 0; col < cols; col++) {
            if (row == 2 && col == 2) {
                el = criarElementoIndio()
            } else {
                el = criarElementoNumero(row, col)
                numerosElementos[row][col] = el
            }

            bingoEl.appendChild(el)
        }
    }
}

function criarElementoIndio() {
    let el = document.createElement('div')
    el.id = 'indio'

    let img = document.createElement('img')
    img.src = 'indian.png'

    el.appendChild(img)

    return el
}

function criarElementoNumero(row, col) {
    let el = document.createElement('input')
    el.type = 'number'
    el.min = colMin(col)
    el.max = colMax(col)
    el.dataset.row = row
    el.dataset.col = col
    el.dataset.k = calcularK(row, col)
    el.dataset.selected = 0

    el.addEventListener('blur', numeroBlurHandle)
    el.addEventListener('click', numeroClickHandle)

    return el
}

function jogarBtnHandle() {
    if (modo != 1) return

    modo = 2
    atualizarBotoes()

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row == 2 && col == 2) {
                continue
            }

            numerosElementos[row][col].readOnly = true
        }
    }
}

function limparBtnHandle() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row == 2 && col == 2) {
                continue
            }

            limparNumero(row, col)
        }
    }
}

function limparNumero(row, col) {
    numerosElementos[row][col].value = ''
    numeros[row][col] = EMPTY_NUMBER
}

function novoBtnHandle() {
    novoJogo()
}

function novoJogo() {
    numeros = []
    numerosSelecionados = []

    for (let row = 0; row < rows; row++) {
        
        numeros[row] = []
        numerosSelecionados[row] = []

        for (let col = 0; col < cols; col++) {
            numeros[row][col] = EMPTY_NUMBER
            numerosSelecionados[row][col] = false

            if (row != 2 || col != 2) {
                setSelected(row, col, false)
            }
        }
    }

    modo = 1
    atualizarBotoes()
}

function numeroBlurHandle() {
    let el = event.target
    let v = el.value
    let row = parseInt(el.dataset.row)
    let col = parseInt(el.dataset.col)

    if (v == '') {
        limparNumero(row, col)
        return
    }

    let msg = null
    v = parseInt(v)
    if (!Number.isInteger(v)) {
        msg = 'Valor invalido'
    }

    if (msg == null) {
        let min = colMin(col)
        let max = colMax(col)
        if ((v < min) || (v > max)) {
            msg = `Os valores da coluna ${colName[col]} devem estar entre ${min} e ${max}`
        }
    }

    if (msg != null) {
        window.alert(msg)
        el.value = ''
        return
    }

    setNumero(row, col, v)
}

function numeroClickHandle(event) {
    if (modo != 2) return

    let el = event.target
    let row = parseInt(el.dataset.row)
    let col = parseInt(el.dataset.col)
    let selected = (parseInt(el.dataset.selected) == 1)

    setSelected(row, col, !selected)

    testarCheckpoint()
}

function setSelected(row, col, selected) {
    numerosElementos[row][col].className = selected ? 'checked' : ''
    numerosElementos[row][col].dataset.selected = selected ? 1 : 0
    numerosSelecionados[row][col] = selected
}

function setNumero(row, col, numero) {
    numeros[row][col] = numero
}

function setNumeroAleatorio(row, col) {
    let numero = 0
    let min = colMin(col)
    let max = colMax(col)

    do {
        numero = Math.floor(Math.random() * (max - min + 1)) + min

        for (let i = 0; i < rows; i++) {
            if (numeros[i][col] == numero) {
                numero = 0
                break
            }
        }
    } while (numero == 0)

    setNumero(row, col, numero)
    return numero
}

function testarCheckpoint() {
    let win = true

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row == 2 && col == 2) {
                continue
            }

            if (numerosSelecionados[row][col] == false) {
                win = false
            }
        }
    }

    if (win) {
        window.alert('BINGOOOO!!')
    }
}