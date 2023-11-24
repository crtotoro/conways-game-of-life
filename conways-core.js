// canvas settings
let canvasWidth = 20; 
let canvasHeight = 40;

let canvas = new Array(canvasHeight).fill(null).map(() => new Array(canvasWidth).fill(0));
let generations = [JSON.parse(JSON.stringify(canvas))];
let currentIndex = 0;

// Initialize the first generation with your seed
function centerAlignSeed(seed) {
  const centerRowIndex = Math.floor(canvas.length / 2) - 1;
  const centerColIndex = Math.floor(canvas[0].length / 2) - 1;
  const seedWidth = seed[0].length;
  const seedHeight = seed.length
  const startCol = centerColIndex - Math.ceil(seedWidth/2);
  const startRow = centerRowIndex - Math.ceil(seedHeight/2);
  for(let row = 0; row < seedHeight; row ++) {
    for(let col = 0; col < seedWidth; col++) {
      canvas[row + startRow][col + startCol] = seed[row][col];
    }
  }
}
const TEST3 = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
const TEST5 = [[1, 1, 1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 0, 1], [0, 1, 0, 0, 0, 1, 1, 1]];
centerAlignSeed(TEST5);


// Update the DOM based on the array
function updateGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = '';

  for (let row = 0; row < 50; row++) {
    for (let col = 0; col < 50; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.backgroundColor = canvas[row][col] ? 'black' : 'white';
      grid.appendChild(cell);
    }
  }

  document.getElementById('left').disabled = currentIndex === 0;
}

// Placeholder for your nextGeneration function
function nextGeneration() {
  // Update array here based on your Conway's Game of Life logic
  // For demonstration, let's randomly toggle some cells
  for (let row = 0; row < 50; row++) {
    for (let col = 0; col < 50; col++) {
      canvas[row][col] = Math.floor(Math.random() * 2);
    }
  }
}

function goForward() {
  if(currentIndex < generations.length -1) {
    canvas = JSON.parse(JSON.stringify(generations[++currentIndex])); 
  } else {
    nextGeneration();
    generations.push(JSON.parse(JSON.stringify(canvas)));
    console.log(generations);
    currentIndex++;
  }
  updateGrid();
}

function goBackward() {
  if (currentIndex > 0) {
    currentIndex--;
    canvas = JSON.parse(JSON.stringify(generations[currentIndex]));
    updateGrid();
  }
}

document.getElementById('right').addEventListener('click', goForward);
document.getElementById('left').addEventListener('click', goBackward);

// Initialize
generations[currentIndex] = JSON.parse(JSON.stringify(canvas));
updateGrid();
