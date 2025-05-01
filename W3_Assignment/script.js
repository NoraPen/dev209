const cardImages = ['images/cow.jpg','images/elephant.jpg','images/giraffe.jpg','images/lion.jpg','images/panda.jpg','images/sheep.jpg',
    'images/tiger.jpg','images/turtle.jpg'];

const doubleImages = [...cardImages, ...cardImages];

doubleImages.sort(() => 0.5 - Math.random());

const grid = document.getElementById("grid");
const header = document.querySelector(".header h2");
const restartButton = document.getElementById("restartButton"); 

let moves = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

function createBoard() {
    const cards = document.querySelectorAll(".blankCard");
cards.forEach(card => card.remove());
    doubleImages.sort(() => 0.5 - Math.random()); // 🔥 Shuffle cards each time you recreate the board
  
    for (let i = 0; i < 16; i++) {
      const card = document.createElement("div");
      card.classList.add("blankCard");
      card.dataset.image = doubleImages[i];
  
      card.addEventListener("click", function () {
        if (lockBoard || card === firstCard) return;
  
        card.style.backgroundImage = `url(${card.dataset.image})`;
        card.style.backgroundSize = "cover";
  
        if (!firstCard) {
          firstCard = card;
        } else {
          secondCard = card;
          lockBoard = true;
          moves++;
          header.textContent = `Moves: ${moves}`;
  
          if (firstCard.dataset.image === secondCard.dataset.image) {
            // Matched
            firstCard = null;
            secondCard = null;
            lockBoard = false;

            matchedPairs++;

            if (matchedPairs === 8) {
                document.getElementById("gameOverSection").style.display = "block";
                document.getElementById("finalScore").textContent = `Moves: ${moves}`;
            }
          } else {
            // No match
            setTimeout(() => {
              firstCard.style.backgroundImage = "";
              secondCard.style.backgroundImage = "";
              firstCard = null;
              secondCard = null;
              lockBoard = false;
            }, 1000);
          }
        }
      });
  
      grid.appendChild(card);
    }
  }



function restartGame() {
    moves = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    header.textContent = `Moves: 0`;
  
    matchedPairs = 0;
    document.getElementById("gameOverSection").style.display = "none";

    createBoard();
  }

  restartButton.addEventListener("click", restartGame);
  

  createBoard();