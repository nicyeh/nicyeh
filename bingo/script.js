const inputsContainer = document.querySelector(".inputs");
const form = document.getElementById("bingo-form");
const boardSection = document.getElementById("board");
const grid = document.querySelector(".grid");

// generate 24 inputs
for (let i = 0; i < 24; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Goal ${i + 1}`;
  inputsContainer.appendChild(input);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const values = [...inputsContainer.querySelectorAll("input")]
    .map(input => input.value.trim())
    .filter(val => val !== "");

  if (values.length !== 24) {
    alert("Please fill in all 24 boxes.");
    return;
  }

  generateBoard(values);
});

function generateBoard(values) {
  grid.innerHTML = "";
  boardSection.classList.remove("hidden");

  shuffle(values);

  let index = 0;

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (i === 12) {
      cell.textContent = "FREE";
      cell.classList.add("free");
    } else {
      cell.textContent = values[index];
      index++;
    }

    grid.appendChild(cell);
  }
}

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}