// Blind Search Sudoku Solver with Step Tracking in TypeScript

type Board = number[][];

type SolveResult = {
  solvedBoard: Board;
  steps: StepProps[];
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

function blindSearch(board: Board, steps: StepProps[]): boolean {
  const SIZE = 9;
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === -1) {
        for (let num = 1; num <= SIZE; num++) {
          steps.push({ position: [row, col], number: num, action: "try" });

          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            steps.push({ position: [row, col], number: num, action: "place" });

            if (blindSearch(board, steps)) return true;

            board[row][col] = -1;
            steps.push({ position: [row, col], number: num, action: "backtrack" });
          }
        }
        return false;
      }
    }
  }
  return true;
}

function SolveSudokuBlindSearch(board: Board): SolveResult {
  const steps: StepProps[] = [];
  blindSearch(board, steps);
  return { solvedBoard: board, steps };
}

export default SolveSudokuBlindSearch; // Import this function to solve Sudoku and track each step
