type Board = number[][];

function SolveSudokuHeuristicSearch(board: Board): {
   solvedBoard: Board;
   steps: StepProps[];
} {
   const steps: StepProps[] = [];

   function isValid(row: number, col: number, num: number): boolean {
      for (let x = 0; x < 9; x++) {
         if (board[row][x] === num || board[x][col] === num) return false;
      }

      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
         }
      }
      return true;
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
                     const num = possibleNums[0];
                     board[row][col] = num;
                     steps.push({
                        position: [row, col],
                        number: num,
                        action: "H place",
                     });
                     changed = true;
                  }
               }
            }
         }
      }
   }

   function backtrack(): boolean {
      scanAndFill();
      for (let row = 0; row < 9; row++) {
         for (let col = 0; col < 9; col++) {
            if (board[row][col] === -1) {
               for (let num = 1; num <= 9; num++) {
                  steps.push({ position: [row, col], number: num, action: "try" });
                  if (isValid(row, col, num)) {
                     board[row][col] = num;
                     steps.push({
                        position: [row, col],
                        number: num,
                        action: "place",
                     });

                     let changed = true;
                     let heuristicBacktrack: StepProps[] = [];
                     while (changed) {
                        changed = false;
                        for (let r = 0; r < 9; r++) {
                           for (let c = 0; c < 9; c++) {
                              if (board[r][c] === -1) {
                                 let possibleNums: number[] = [];
                                 for (let n = 1; n <= 9; n++) {
                                    if (isValid(r, c, n)) {
                                       possibleNums.push(n);
                                    }
                                 }
                                 if (possibleNums.length === 1) {
                                    let num = possibleNums[0];
                                    board[r][c] = num;
                                    steps.push({
                                       position: [r, c],
                                       number: num,
                                       action: "H place",
                                    });
                                    heuristicBacktrack.push({
                                       position: [r, c],
                                       number: num,
                                       action: "H place",
                                    });
                                    changed = true;
                                 }
                              }
                           }
                        }
                     }

                     if (backtrack()) return true;

                     board[row][col] = -1;
                     steps.push({
                        position: [row, col],
                        number: num,
                        action: "backtrack",
                     });
                     for (let step of heuristicBacktrack) {
                        board[step.position[0]][step.position[1]] = -1;
                        steps.push({
                           position: step.position,
                           number: step.number,
                           action: "H backtrack",
                        });
                     }
                  }
               }
               return false;
            }
         }
      }
      return true;
   }

   function solve(): void {
      scanAndFill(); // Fill deterministic cells first
      backtrack(); // Use backtracking for the rest
   }

   solve();
   return { solvedBoard: board, steps };
}

export default SolveSudokuHeuristicSearch;
