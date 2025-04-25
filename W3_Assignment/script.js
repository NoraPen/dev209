const cardImages = ['images/cow.png','images/elephant.png','images/giraffe.png','images/lion.png','images/panda.png','images/sheep.png',
    'images/tuger.png','images/turtle.png'];

let cards = [];

const grid = document.getElementById("grid");

for (let i = 0; i < 16; i++) {
      const card = document.createElement("div");
      card.classList.add("blankCard");
      grid.appendChild(card);
}