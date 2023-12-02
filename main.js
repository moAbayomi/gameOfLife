document.addEventListener("DOMContentLoaded", () => {
  console.log(`Conway’s Game of Life is a simple simulation that creates artificial “life” on a grid, each cell of which is either alive or not. Each generation (turn), the following rules are applied:

Any live cell with fewer than two or more than three live neighbors dies.

Any live cell with two or three live neighbors lives on to the next generation.

Any dead cell with exactly three live neighbors becomes a live cell.

A neighbor is defined as any adjacent cell, including diagonally adjacent ones.

Note that these rules are applied to the whole grid at once, not one square at a time. That means the counting of neighbors is based on the situation at the start of the generation, and changes happening to neighbor cells during this generation should not influence the new state of a given cell.

Implement this game using whichever data structure you find appropriate. Use Math.random to populate the grid with a random pattern initially. Display it as a grid of checkbox fields, with a button next to it to advance to the next generation. When the user checks or unchecks the checkboxes, their changes should be included when computing the next generation.`);

  const html = document.querySelector("html");

  const styles = window.getComputedStyle(html);
  const cols = styles.getPropertyValue("--cols");
  const rows = styles.getPropertyValue("--rows");
  console.log(cols, rows);

  const gridWidth = rows;
  const gridHeight = cols;
  const minNeighborsAlive = 2;
  const maxNeighborsAlive = 3;

  let grid = document.querySelector("#grid");

  let next = document.querySelector("#next-gen");
  let autorun = document.querySelector("#auto-run");
  let stop = document.querySelector("#stop");

  function generateCell(input, row, col) {
    return Object.assign(Object.create(null), {
      element: input,
      row: row + 1,
      col: col + 1,
      alive: input.checked,
    });
  }

  function cellStatusChange(event) {
    stopSimulation();
    let target = this.firstChild;
    target.checked = !target.checked;

    if (target.checked == true) {
      this.style.background = "lightblue";
    } else {
      this.style.background = "red";
    }

    const row = Number(event.target.getAttribute("data-row"));
    const col = Number(event.target.getAttribute("data-col"));

    let index = row * gridWidth + col;
    console.log(cells[index]);
    console.log(cells[index].alive);

    cells[index].alive = target.checked;
    console.log(cells[index].alive);
  }

  function createCellGrid(width, height) {
    let cells = [];

    for (let row = 0; row < width; row++) {
      // Set display to flex for horizontal alignment

      for (let col = 0; col < height; col++) {
        let div = document.createElement("div");

        div.style.width = "24px";
        div.style.height = "24px";
        div.setAttribute("id", "cell");
        div.setAttribute("data-row", row);
        div.setAttribute("data-col", col);
        let input = document.createElement("input");
        input.type = "checkbox";
        input.style.display = "none";

        div.appendChild(input);

        if (Math.random() < 0.5) {
          input.setAttribute("checked", input);
          input.parentElement.style.background = "lightblue";
        }

        div.addEventListener("click", cellStatusChange);

        grid.appendChild(div);
        cells.push(generateCell(input, row, col));
      }
    }
    return cells;
  }

  let cells = createCellGrid(gridWidth, gridHeight);

  function getNeighbors(centralCell) {
    const minAdjRow = centralCell.row - 1;
    const maxAdjRow = centralCell.row + 1;
    const minAdjCol = centralCell.col - 1;
    const maxAdjCol = centralCell.col + 1;
    // neigbors => adjacentRows && adjacentCols && !centralCell
    return cells.filter((cell) => {
      return (
        cell.row >= minAdjRow &&
        cell.row <= maxAdjRow &&
        cell.col >= minAdjCol &&
        cell.col <= maxAdjCol &&
        // why this condition ?
        !(cell.row == centralCell.row && cell.col == centralCell.col)
      );
    });
  }

  function getAliveNeighborsCount(neighbors) {
    return neighbors.reduce((aliveCount, current) => {
      if (current.alive) aliveCount++;
      return aliveCount;
    }, 0);
  }

  function IsCellAliveInNextGen(cell) {
    let aliveNeighborsCount = getAliveNeighborsCount(getNeighbors(cell));
    let survives =
      aliveNeighborsCount >= minNeighborsAlive &&
      aliveNeighborsCount <= maxNeighborsAlive;
    let reborn = aliveNeighborsCount == maxNeighborsAlive;

    if (cell.alive) return survives;
    else return reborn;
  }

  function generateNextGen(cells) {
    let nextCells = [];

    for (let cell of cells) {
      let nextCell = Object.create(null);
      nextCell.element = cell.element;
      nextCell.row = cell.row;
      nextCell.col = cell.col;
      nextCell.alive = IsCellAliveInNextGen(cell);
      nextCells.push(nextCell);
    }

    return nextCells;
  }

  function updateGrid() {
    let nextCells = generateNextGen(cells);
    nextCells.forEach((cell) => {
      cell.element.checked = cell.alive;
      cell.element.checked == true
        ? (cell.element.parentElement.style.background = "white")
        : (cell.element.parentElement.style.background = "black");
    });
    cells = nextCells;
  }

  // Add event handler for "Click" event to the "Next generation" button.
  next.addEventListener("click", updateGrid);

  let simulate;

  function autorunSimulation() {
    simulate = setInterval(() => {
      updateGrid();
    }, 500);
    autorun.disabled = true;
    next.disabled = true;
    stop.style.display = "inline-block";
  }

  function stopSimulation() {
    clearInterval(simulate);
    autorun.disabled = false;
    next.disabled = false;
    stop.style.display = "none";
  }

  autorun.addEventListener("click", autorunSimulation);

  // Add event handler for "Click" event to the "Stop Simulation" button.
  stop.addEventListener("click", stopSimulation);
});
