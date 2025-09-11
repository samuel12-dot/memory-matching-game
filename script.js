const moves = document.getElementById('moves-count')
const timeValue = document.getElementById('time')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const gameContainer = document.querySelector('.game-container')
const result = document.getElementById('result')
const controls = document.querySelector('.controls-container')

let cards
let interval
let firstCard = false
let secondCard = false
let firstCardValue = null

//Items array
const items = [
  { name: 'bee', image: './img/bee.png' },
  { name: 'crocodile', image: './img/crocodile.png' },
  { name: 'macaw', image: './img/macaw.png' },
  { name: 'gorilla', image: './img/gorilla.png' },
  { name: 'tiger', image: './img/tiger.png' },
  { name: 'monkey', image: './img/monkey.png' },
  { name: 'chameleon', image: './img/chameleon.png' },
  { name: 'fish', image: './img/fish.png' },
  { name: 'snake', image: './img/snake.png' },
  { name: 'sloth', image: './img/sloth.png' },
]

//Initial time
let seconds = 0
let minutes = 0

//Initial moves and win count
let movesCount = 0
let winCount = 0

//For timer
const timeGenerator = () => {
  seconds += 1

  if (seconds >= 60) {
    minutes += 1
    seconds = 0
  }

  let secondsValue = seconds < 10 ? `0${seconds}` : seconds
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`
}

//For calculating moves
const movesCounter = () => {
  movesCount += 1
  moves.innerHTML = `<span>Moves:</span>${movesCount}`
}

//Pick random objects from the item array
const generateRandom = (size = 4) => {
  let tempArray = [...items]
  let cardValues = []
  size = (size * size) / 2

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length)
    cardValues.push(tempArray[randomIndex])
    tempArray.splice(randomIndex, 1)
  }
  return cardValues
}

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = ''
  cardValues = [...cardValues, ...cardValues]

  //shuffle
  cardValues.sort(() => Math.random() - 0.5)

  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image" width="80" height="80" />
        </div>
      </div>
    `
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`

  //Cards
  cards = document.querySelectorAll('.card-container')
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('matched') && !card.classList.contains('flipped')) {
        card.classList.add('flipped')

        if (!firstCard) {
          firstCard = card
          firstCardValue = card.getAttribute('data-card-value')
        } else {
          movesCounter()
          secondCard = card
          let secondCardValue = card.getAttribute('data-card-value')

          if (firstCardValue === secondCardValue) {
            firstCard.classList.add('matched')
            secondCard.classList.add('matched')
            firstCard = false
            secondCard = false
            winCount += 1

            if (winCount === Math.floor(cardValues.length / 2)) {
              result.innerHTML = `
                <h2>You Won</h2>
                <h4>Moves: ${movesCount}</h4>
              `
              stopGame()
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard]
            firstCard = false
            secondCard = false
            setTimeout(() => {
              tempFirst.classList.remove('flipped')
              tempSecond.classList.remove('flipped')
            }, 900)
          }
        }
      }
    })
  })
}

//Start game
startButton.addEventListener('click', () => {
  movesCount = 0
  seconds = 0
  minutes = 0

  controls.classList.add('hide')
  stopButton.classList.remove('hide')
  startButton.classList.add('hide')

  interval = setInterval(timeGenerator, 1000)

  moves.innerHTML = `<span>Moves:</span> ${movesCount}`
  initializer()
})

//Stop game
function stopGame() {
  controls.classList.remove('hide')
  stopButton.classList.add('hide')
  startButton.classList.remove('hide')
  clearInterval(interval)
}

//Initialize values and func calls
const initializer = () => {
  result.innerText = ''
  winCount = 0
  firstCard = false
  secondCard = false
  let cardValues = generateRandom()
  matrixGenerator(cardValues)
}
