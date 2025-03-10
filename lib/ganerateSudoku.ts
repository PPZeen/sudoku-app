// Sudoku Generator for Next.js Frontend with Difficulty Levels and Solvability Check

type Board = number[][];

type DifficultyLevels = {
  [key: number]: number;
};

function isSafe(board: Board, row: number, col: number, num: number): boolean {
  const SIZE = 9;
  const BOX_SIZE = 3;

  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }

  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
}

function fillSudoku(board: Board): boolean {
  const SIZE = 9;
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        const numbers = [...Array(SIZE).keys()].map((x) => x + 1).sort(() => Math.random() - 0.5);
        for (let num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (fillSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board): number {
  let count = 0;
  const SIZE = 9;

  function solve() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === -1) {
          for (let num = 1; num <= SIZE; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              solve();
              board[row][col] = -1;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve();
  return count;
}

function removeNumbers(board: Board, attempts: number): void {
  const SIZE = 9;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    if (board[row][col] !== -1) {
      const backup = board[row][col];
      board[row][col] = -1;

      const boardCopy: Board = board.map((row) => [...row]);
      if (countSolutions(boardCopy) !== 1) {
        board[row][col] = backup; // Revert if multiple solutions
      } else {
        attempts--;
      }
    }
  }
}

function generateSudoku(difficulty: number = 1): Board {
  const SIZE = 9;
  const difficultyLevels: DifficultyLevels = {
    1: 20,
    2: 40,
    3: 52,
  };

  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  fillSudoku(board);
  removeNumbers(board, difficultyLevels[difficulty] || 40);

  return board;
}

export default generateSudoku; // Import this in your Next.js component to generate Sudoku puzzles
