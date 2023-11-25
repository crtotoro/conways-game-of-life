function padGrid(grid) {
  for(let row of grid) { row.unshift(0); row.push(0); }
  grid.unshift(new Array(grid[0].length).fill(0));
  grid.push(new Array(grid[0].length).fill(0));
  return grid;
}

function getNextGen(currentGen) {
  let nextGen = currentGen.map(row => new Array(row.length).fill(0));
  const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  const handleBounds = (grid, row, col) => grid[row] && grid[row][col] ? grid[row][col] : 0;

  for(let row = 0; row < currentGen.length; row++) {
    for(let col = 0; col < currentGen[row].length; col++) {
      let livingNeighbors = neighbors.reduce((living, neighbor) => living + handleBounds(currentGen, row+neighbor[0], col+neighbor[1]), 0);
      
      if(currentGen[row][col] === 1) {
        if(livingNeighbors >= 2 && livingNeighbors <= 3) nextGen[row][col] = 1;
      } 
      else if(livingNeighbors === 3) nextGen[row][col] = 1;
    }
  }
  return nextGen;
}

function cropGrid(grid) {
  let croppedGrid = grid.map(row => [...row], []);
  // check the sum of values in each row
  let rowSums = croppedGrid.map(row => row.reduce((sum, cell) => sum + cell, 0))

  // starting from the top, trim each row that is empty until a row with a living cell (rowSum > 0) is reached
  for(let i = 0; i < rowSums.length; i++) {
    if(rowSums[i] > 0) break;
    croppedGrid.shift();
  }

  // starting from the bottom, trim each row that is empty until a row with a living cell is reached
  for(let i = rowSums.length-1; i >= 0; i--) {
    if(rowSums[i] > 0) break;
    croppedGrid.pop();
  }

  // check the sum of values in each column
  let colSums = [];
  for(let row of croppedGrid) {
    for(let i = 0; i < croppedGrid[0].length; i++) {
      if(!colSums[i] && colSums[i] !== 0) colSums.push(row[i]);
      else colSums[i] += row[i];
    }
  }

  // starting from the left, trim each column that is empty until a column with a living cell (colSum > 0) is reached
  for(let i = 0; i < colSums.length; i++) {
    if(colSums[i] > 0) break;
    for(let row of croppedGrid) row.shift();
  }

  // starting from the right, trim each column that is empty until a column with a living cell is reached
  for(let i = colSums.length-1; i >= 0; i--) {
    if(colSums[i] > 0) break;
    for(let row of croppedGrid) row.pop();
  }
  return croppedGrid;
}


