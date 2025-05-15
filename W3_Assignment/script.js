const cardImages = [
  'images/cow.jpg', 'images/elephant.jpg', 'images/giraffe.jpg', 'images/lion.jpg',
  'images/panda.jpg', 'images/sheep.jpg', 'images/tiger.jpg', 'images/turtle.jpg'
];

const doubleImages = [...cardImages, ...cardImages];

const grid = document.getElementById("grid");
const header = document.querySelector(".header h2");
const restartButton = document.getElementById("restartButton");
let moves = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// Assign a unique ID per tab
let tabId = sessionStorage.getItem("tabId");
if (!tabId) {
  tabId = Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem("tabId", tabId);
}

// Initialize localStorage entry for this tab if needed
if (!localStorage.getItem(`moves_${tabId}`)) {
  localStorage.setItem(`moves_${tabId}`, "0");
}

// Update this tab's move count and total across tabs
function updateTabMoveCount() {
  const offset = parseInt(localStorage.getItem(`restartOffset_${tabId}`)) || 0;
  localStorage.setItem(`moves_${tabId}`, (moves + offset).toString());
  updateTotalMovesAcrossTabs();
}

// Sum all moves across all tabs
function updateTotalMovesAcrossTabs() {
  let total = 0;
  for (let key in localStorage) {
    if (key.startsWith("moves_")) {
      total += parseInt(localStorage.getItem(key)) || 0;
    }
  }
  localStorage.setItem("totalMoves", total);
  document.getElementById("totalMoves").textContent = `Total Moves: ${total}`;
}

// React to other tabs updating totalMoves
window.addEventListener("storage", (e) => {
  if (e.key === "totalMoves") {
    document.getElementById("totalMoves").textContent = `Total Moves: ${e.newValue}`;
  }
});

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Only save matched cards as flipped
function saveGameState() {
  const cards = document.querySelectorAll(".blankCard");
  const cardStates = Array.from(cards).map(card => ({
    image: card.dataset.image,
    flipped: card.style.backgroundImage !== "" && card.onclick === null
  }));

  const state = {
    images: cardStates,
    moves,
    matchedPairs
  };

  localStorage.setItem(`memoryGameState_${tabId}`, JSON.stringify(state));
}

function handleCardClick() {
  const card = this;
  if (lockBoard || card === firstCard || card.style.backgroundImage) return;

  card.style.backgroundImage = `url(${card.dataset.image})`;
  card.style.backgroundSize = "cover";

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    moves++;
    header.textContent = `Score: ${moves}`;
    updateTabMoveCount();

    if (firstCard.dataset.image === secondCard.dataset.image) {
      firstCard.onclick = null;
      secondCard.onclick = null;
      matchedPairs++;
      resetTurn();

      if (matchedPairs === 8) {
        document.getElementById("gameOverSection").style.display = "block";
        document.getElementById("finalScore").textContent = `Score: ${moves}`;
      }

      saveGameState();
    } else {
      setTimeout(() => {
        firstCard.style.backgroundImage = "";
        secondCard.style.backgroundImage = "";
        resetTurn();
        saveGameState(); // Save after flipping back
      }, 1000);
    }
  }
}

function createBoard() {
  const cards = document.querySelectorAll(".blankCard");
  cards.forEach(card => {
    card.removeEventListener("click", handleCardClick);
    card.remove();
  });

  doubleImages.sort(() => 0.5 - Math.random());

  const savedState = localStorage.getItem(`memoryGameState_${tabId}`);
  if (savedState) {
    const state = JSON.parse(savedState);
    moves = state.moves || 0;
    matchedPairs = state.matchedPairs || 0;
    header.textContent = `Score: ${moves}`;
    const savedImages = state.images;

    for (let i = 0; i < 16; i++) {
      const card = document.createElement("div");
      card.classList.add("blankCard");
      card.dataset.image = savedImages[i].image;

      if (savedImages[i].flipped) {
        card.style.backgroundImage = `url(${card.dataset.image})`;
        card.style.backgroundSize = "cover";
        card.onclick = null;
      } else {
        card.addEventListener("click", handleCardClick);
      }
      grid.appendChild(card);
    }
  } else {
    for (let i = 0; i < 16; i++) {
      const card = document.createElement("div");
      card.classList.add("blankCard");
      card.dataset.image = doubleImages[i];
      card.addEventListener("click", handleCardClick);
      grid.appendChild(card);
    }
  }

  updateTabMoveCount();
}
function restartGame() {
  localStorage.removeItem(`memoryGameState_${tabId}`);

  // Get current offset and add current moves
  const oldOffset = parseInt(localStorage.getItem(`restartOffset_${tabId}`)) || 0;
  const newOffset = oldOffset + moves;
  localStorage.setItem(`restartOffset_${tabId}`, newOffset.toString());

  // Reset values for new game
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  header.textContent = `Score: 0`;
  document.getElementById("gameOverSection").style.display = "none";

  createBoard();
}

restartButton.addEventListener("click", restartGame);

createBoard();
updateTotalMovesAcrossTabs();
