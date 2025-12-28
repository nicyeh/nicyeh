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
    alert("please fill all of them!");
    return;
  }

  generateBoard(values);
});

function generateBoard(values) {
  grid.innerHTML = "";
  boardSection.classList.remove("hidden");

  shuffle(values);
  boardState = [];

  let valueIndex = 0;

  for (let i = 0; i < 25; i++) {
    let cellData;

    if (i === 12) {
      cellData = { text: "FREE", marked: false };
    } else {
      cellData = { text: values[valueIndex], marked: false };
      valueIndex++;
    }

    boardState.push(cellData);
  }

  renderBoard();
}

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const saveButton = document.getElementById("save-board");

saveButton.addEventListener("click", async () => {
  // First, download the PNG
  const canvas = await html2canvas(grid);
  const link = document.createElement("a");
  link.download = "bingo-board.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  // Then, generate and navigate to the unique URL
  const encoded = btoa(JSON.stringify(boardState));
  const newUrl = `${window.location.origin}/bingo?board=${encoded}`;
  window.location.href = newUrl;
});

function renderBoard() {
  grid.innerHTML = "";

  boardState.forEach((cellData, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (cellData.text === "FREE") {
      cell.classList.add("free");
    }

    if (cellData.marked) {
      cell.classList.add("marked");
    }

    cell.textContent = cellData.text;

    cell.addEventListener("click", () => {
      boardState[index].marked = !boardState[index].marked;
      cell.classList.toggle("marked");
      updateURL();
    });

    grid.appendChild(cell);
  });
}

function updateURL() {
  const encoded = btoa(JSON.stringify(boardState));
  const url = `${window.location.pathname}?board=${encoded}`;
  window.history.replaceState(null, "", url);
}

function loadBoardFromURL() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("board");

  if (!data) return;

  try {
    boardState = JSON.parse(atob(data));
    boardSection.classList.remove("hidden");
    renderBoard();

    // Hide the input fields if the board data is present
    if (boardState && boardState.length === 25) {
      const form = document.getElementById("bingo-form");
      if (form) {
        form.classList.add("hidden");
      }
    }
  } catch (e) {
    console.error("Invalid board data");
  }
}