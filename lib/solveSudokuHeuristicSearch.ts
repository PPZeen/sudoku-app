type Board = number[][];

type Step = {
  position: [number, number];
  number: number;
  action: "place" | "try" | "backtrack";
};

type SolveResult = {
  solvedBoard: Board;
  steps: Step[];
};

function SolveSudokuHeuristicSearch(board: Board): SolveResult {
  let steps: Step[] = [];
  let markgrid: number[][][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => Array(9).fill(0))
  );
  let markrow: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  let markcol: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(row: number, col: number, num: number): boolean {
    num--;
    return (
      !markgrid[Math.floor(row / 3)][Math.floor(col / 3)][num] &&
      !markrow[row][num] &&
      !markcol[col][num]
    );
  }

  function initializeMarks(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== -1) {
          let num = board[i][j] - 1;
          markgrid[Math.floor(i / 3)][Math.floor(j / 3)][num] = 1;
          markrow[i][num] = 1;
          markcol[j][num] = 1;
        }
      }
    }
  }

  function scanAndFill(): void {
    let changed = true;
    while (changed) {
      changed = false;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === -1) {
            let possibleNums: number[] = [];
            for (let num = 1; num <= 9; num++) {
              if (isValid(row, col, num)) {
                possibleNums.push(num);
              }
            }
            if (possibleNums.length === 1) {
              let num = possibleNums[0];
              board[row][col] = num;
              steps.push({ position: [row, col], number: num, action: "place" });
              let index = num - 1;
              markgrid[Math.floor(row / 3)][Math.floor(col / 3)][index] = 1;
              markrow[row][index] = 1;
              markcol[col][index] = 1;
              changed = true;
            }
          }
        }
      }
    }
  }

  function backtrack(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === -1) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
              let indexNum = num - 1;
              board[row][col] = num;
              markgrid[Math.floor(row / 3)][Math.floor(col / 3)][indexNum] = 1;
              markrow[row][indexNum] = 1;
              markcol[col][indexNum] = 1;
              steps.push({ position: [row, col], number: num, action: "try" });

              if (backtrack()) return true;

              board[row][col] = -1;
              markgrid[Math.floor(row / 3)][Math.floor(col / 3)][indexNum] = 0;
              markrow[row][indexNum] = 0;
              markcol[col][indexNum] = 0;
              steps.push({ position: [row, col], number: num, action: "backtrack" });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function solve(): void {
    initializeMarks();
    scanAndFill();
    backtrack();
  }

  solve();
  return { solvedBoard: board, steps };
}

export default SolveSudokuHeuristicSearch;
