let numberElements
let colElements = [0,1,2,3,4,0,1,2,3,4,0,1,3,4,0,1,2,3,4,0,1,2,3,4]
let numbers, numbersSelected
// 1 = complete / 2 = play
let mode = 0
let newGameBtn, autocompleteBtn, playBtn

window.onload = init

function init() {
    numberElements = document.querySelectorAll('#bingo input')

    newGameBtn = document.querySelector('#newGameBtn')
    autocompleteBtn = document.querySelector('#autocompleteBtn')
    playBtn = document.querySelector('#playBtn')

    newGameBtn.addEventListener('click', newGameBtnHandle)
    autocompleteBtn.addEventListener('click', autoCompleteBtnHandle)
    playBtn.addEventListener('click', playBtnHandle)

    numberElements.forEach((element, k) => {
        element.addEventListener('blur', numberBlurHandle)
        element.addEventListener('click', numberHandle)
    })

    refreshButtons()
}

function newGameBtnHandle() {
    if (mode != 0) {
        if (!window.confirm('Existe um jogo em andamento. Deseja reiniciar?')) return
    }

    numbers = []
    numbersSelected = []
    checkpointRow = false
    checkpointCol = false

    numberElements.forEach((element, k) => {
        element.value = ''
        element.className = ''
        element.readOnly = false

        numbersSelected.push(0)
    })

    mode = 1
    refreshButtons()
}

function autoCompleteBtnHandle() {
    if (mode != 1) return

    numbers = []

    numberElements.forEach((element, k) => {
        let col = colElements[k]
        let min = (15 * col) + 1
        let max = min + 14 //(col + 1) * 15

        number = getRandomInt(min, max)
        element.value = number

        numbers.push(number)
    })
}

function playBtnHandle() {
    if (mode != 1) return

    mode = 2
    setNumberElementsReadonly(true)

    refreshButtons()
}

function numberHandle(event) {
    if (mode != 2) return

    let element = event.target
    let checked = (element.className == 'checked')
    let v = parseInt(element.value)

    if (checked) {
        element.className = ''
        numbersSelected[numbers.indexOf(v)] = 0
    } else {
        element.className = 'checked'
        numbersSelected[numbers.indexOf(v)] = 1
    }

    checkpoint()
}

function numberBlurHandle(event) {
    let el = event.target
    let v = el.value
}

function checkpoint() {
    let ok, i

    ok = numbersSelected.indexOf(0) == -1
    if (ok) {
        window.alert('BINGOO!!')
        return
    }
}

function refreshButtons() {
    switch(mode) {
        case 0:
            newGameBtn.disabled = false
            autocompleteBtn.disabled = true
            playBtn.disabled = true
            return
        case 1:
            newGameBtn.disabled = true
            autocompleteBtn.disabled = false
            playBtn.disabled = false
            return
        
        case 2:
            newGameBtn.disabled = false
            autocompleteBtn.disabled = true
            playBtn.disabled = true
            return
    }
}

function setNumberElementsReadonly(readOnly) {
    numberElements.forEach(element => {
        element.readOnly = readOnly
        element.className = readOnly ? 'readonly' : ''
    })
}

function getRandomAtArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min, max) {
    let number
    do {
        number = Math.floor(Math.random() * (max - min + 1) ) + min

    } while (numbers.indexOf(number) > -1)

    return number
  }