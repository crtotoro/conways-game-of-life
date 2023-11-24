function getGeneration(cells, generations){
  let nextGen = cells.map(row => [...row], []);

  for(let genCount = 0; genCount < generations; genCount++) {
    nextGen = cropGrid(getNextGen(padGrid(nextGen)));
  }
  return nextGen;
}

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


function consoleLogGen(cells, generation=0) {
  const gridIcons = {0: ' ', 1: '#'}
  console.log('Generation ' + generation + '\n' + '-'.repeat(cells[0].length*2+1));
  for(let arr of cells) console.log('|' + arr.map(cell => gridIcons[cell]).join('|') + '|');
  console.log('-'.repeat(cells[0].length*2+1));
}

testFunction(getGeneration)


// Test Suite
function testFunction(func){
  function assertEquals(input,actual,expected,testName) {
    if(actual.join() === expected.join()) return '\npassed - ' + testName;
    return `\nFAILED - ${testName}\nInput of ${input} returned: [${actual}] but expected: [${expected}]`
  }

  let TEST1 = [[1,0,1,0,0,0,1,0,0,1],[0,1,1,0,1,0,1,0,0,0],[0,1,0,1,0,0,0,0,1,1],[1,1,1,0,0,1,0,0,0,1],[0,1,0,0,0,0,0,1,0,0]];
  consoleLogGen(TEST1)
  const TEST1_GEN = 9;
  const TEST1_ACTUAL = func(TEST1,TEST1_GEN);
  const TEST1_EXPECTED = [[0,0,0,0,0,0,0,1,0],[0,1,0,0,0,0,1,0,0],[1,1,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,1],[0,0,0,0,0,1,0,1,0]];
  const TEST1_NAME = 'Test1';
  console.log(assertEquals(TEST1,TEST1_ACTUAL,TEST1_EXPECTED,TEST1_NAME));
  consoleLogGen(TEST1)

  const TEST2_ACTUAL = [[0, 0, 1, 0],	[0, 1, 0, 1],	[1, 0, 1, 1], [0, 1, 1, 0]];
  const TEST2_GEN = 3
  const TEST2_ACTUAL_ACTUAL = func(TEST2_ACTUAL,TEST2_GEN);
  const TEST2_ACTUAL_EXPECTED = [[0, 0, 1, 0, 0],	[0, 1, 0, 1, 1],	[1, 0, 0, 0, 1],	[0, 1, 0, 0, 1], [0, 1, 1, 1, 0]];
  const TEST2_ACTUAL_NAME = 'Test2';
  console.log(assertEquals(TEST2_ACTUAL,TEST2_ACTUAL_ACTUAL,TEST2_ACTUAL_EXPECTED,TEST2_ACTUAL_NAME));

  const TEST3 = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
  const TEST3_GEN = 0
  const TEST3_ACTUAL = func(TEST3,TEST3_GEN);
  const TEST3_EXPECTED = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
  const TEST3_NAME = 'Test3';
  console.log(assertEquals(TEST3,TEST3_ACTUAL,TEST3_EXPECTED,TEST3_NAME));

  const TEST4 = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
  const TEST4_GEN = 40
  const TEST4_ACTUAL = func(TEST4,TEST4_GEN);
  const TEST4_EXPECTED = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
  const TEST4_NAME = 'Test4';
  console.log(assertEquals(TEST4,TEST4_ACTUAL,TEST4_EXPECTED,TEST4_NAME));  

  const TEST5 = [[1, 1, 1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 0, 1], [0, 1, 0, 0, 0, 1, 1, 1]];
  const TEST5_GEN = 16
  const TEST5_ACTUAL = func(TEST5,TEST5_GEN);
  const TEST5_EXPECTED = [];
  function pushIt(str) {
    TEST5_EXPECTED.push(str.split(''))
  }
  
  pushIt("1110000000000000")
  pushIt("1000000000000000")
  pushIt("0100000000000000")
  pushIt("0000000000000000")
  pushIt("0000000000000000")
  pushIt("0000000000000000")
  pushIt("0000000000000000")
  pushIt("0000000000000000")
  pushIt("0000000000000010")
  pushIt("0000000000000001")
  pushIt("0000000000000111")
  const TEST5_NAME = 'Test5';
  console.log(assertEquals(TEST5,TEST5_ACTUAL,TEST5_EXPECTED,TEST5_NAME));  



  // const TESTX = [[0, 1, 0], [0, 0, 1], [1, 1, 1]];
  // const TESTX_GEN = 1
  // const TESTX_ACTUAL = func(TESTX,TESTX_GEN);
  // const TESTX_EXPECTED = [];
  // const TESTX_NAME = 'TestX';
  // console.log(assertEquals(TESTX,TESTX_ACTUAL,TESTX_EXPECTED,TESTX_NAME));


}

