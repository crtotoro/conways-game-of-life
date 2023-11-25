// canvas settings
let canvasWidth = 10; 
let canvasHeight = 10;
document.documentElement.style.setProperty("--width", canvasWidth);
document.documentElement.style.setProperty("--height", canvasHeight);

let canvas = new Array(canvasHeight).fill(null).map(() => new Array(canvasWidth).fill(0));
let generation = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
let generations = [JSON.parse(JSON.stringify(generation))];
let currentIndex = 0;

// Center the current generation on the canvas
function centerAlignGeneration(generation) {
  const centerRowIndex = Math.floor(canvasHeight / 2);
  const centerColIndex = Math.floor(canvasWidth / 2);
  const genWidth = generation[0].length;
  const genHeight = generation.length
  const startCol = centerColIndex - (canvasWidth % 2 ? Math.floor(genWidth / 2) : Math.ceil(genWidth / 2));
  const startRow = centerRowIndex - (canvasHeight % 2 ? Math.floor(genHeight / 2) : Math.ceil(genHeight / 2));
  for(let row = 0; row < genHeight; row ++) {
    for(let col = 0; col < genWidth; col++) {
      canvas[row + startRow][col + startCol] = generation[row][col];
    }
  }
}

centerAlignGeneration(generation);


// Update the DOM based on the array
function updateGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = '';

  for (let row = 0; row < canvasHeight; row++) {
    for (let col = 0; col < canvasWidth; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.backgroundColor = canvas[row][col] ? 'black' : 'white';
      grid.appendChild(cell);
    }
  }

  document.getElementById('left').disabled = currentIndex === 0;
}

// Placeholder for your nextGeneration function
function nextGeneration(currentGen) {
  let nextGen = currentGen.map(row => [...row], []);
  generation = cropGrid(getNextGen(padGrid(nextGen)));
  centerAlignGeneration(generation);
}

function goForward() {
  if(currentIndex < generations.length -1) {
    centerAlignGeneration(generations[++currentIndex]);
  } else {
    nextGeneration(generation);
    generations.push(JSON.parse(JSON.stringify(generation)));
    currentIndex++;
  }
  updateGrid();
}

function goBackward() {
  if (currentIndex > 0) {
    centerAlignGeneration(generations[--currentIndex])
    updateGrid();
  }
}

document.getElementById('right').addEventListener('click', goForward);
document.getElementById('left').addEventListener('click', goBackward);

// Initialize
generations[currentIndex] = JSON.parse(JSON.stringify(generation));
updateGrid();
