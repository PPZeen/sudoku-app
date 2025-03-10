"use client";

import React, { useEffect, useState, Suspense } from 'react'

import { useSearchParams } from 'next/navigation';

import { UilPlay, UilPause, UilStopwatch, UilBars, UilTachometerFastAlt, UilCheckCircle, UilLightbulbAlt, UilRedo, UilPuzzlePiece } from '@iconscout/react-unicons';

import { GenerateSudoku, SolveSudokuBlindSearch, SolveSudokuHeuristicSearch } from '@/lib';
import { Dialog, GamePause, GameSolved, SolvedBoard } from "@/components";

const Page = () => {
   const searchParams = useSearchParams();
   const level = parseInt(searchParams.get('level')!);

   const size: number[] = Array.from({ length: 9 }, (_, i) => i + 1);

   const [isGenerate, setIsGenerate] = useState<boolean>(false);
   const [isEndGame, setIsEndGame] = useState<boolean>(false);

   const [board, setBoard] = useState<number[][]>([]);
   const [boardCurrent, setBoardCurrent] = useState<number[][]>([]);
   const [boardBlindSearch, setBoardBlindSearch] = useState<number[][]>([]);
   const [boardHeuristicSearch, setBoardHeuristicSearch] = useState<number[][]>([]);

   const [stepsBlindSearch, setStepsBlindSearch] = useState<StepProps[]>();
   const [stepsHeuristicSearch, setStepsHeuristicSearch] = useState<StepProps[]>();

   const [showSolvedBlindSearch, setShowSolvedBlindSearch] = useState<boolean>(false);
   const [showSolvedHeuristicSearch, setShowSolvedHeuristicSearch] = useState<boolean>(false);

   const [number, setNumber] = useState<number>(1);
   const [countHint, setCountHint] = useState<number>(level == 1 ? 3 : (level == 2 ? 5: 10)); // 52

   const [time, setTime] = useState<number>(0);
   const [isRunning, setIsRunning] = useState<boolean>(true);

   const [showReStart, setShowReStart] = useState(false);

   useEffect(() => {
      if (!isGenerate) {
         const sudoku = GenerateSudoku(level);
         setBoard(sudoku);
         setBoardCurrent(sudoku);
         
         const copySudoku = sudoku.map(row => [...row]);
         const solvedByBlindSearch = SolveSudokuBlindSearch(copySudoku);
         setBoardBlindSearch(solvedByBlindSearch["solvedBoard"]);
         setStepsBlindSearch(solvedByBlindSearch["steps"]);

         const copySudoku2 = sudoku.map(row => [...row]);
         const solvedByHeuristicSearch = SolveSudokuHeuristicSearch(copySudoku2);
         setBoardHeuristicSearch(solvedByHeuristicSearch["solvedBoard"]);
         setStepsHeuristicSearch(solvedByHeuristicSearch["steps"]);

         setIsGenerate(true);
      }

      if (!isRunning || isEndGame || showReStart || showSolvedBlindSearch || showSolvedHeuristicSearch) return;

      const timer = setInterval(() => {
         setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer);

   }, [isRunning, isEndGame, showReStart, isGenerate, level, showSolvedBlindSearch, showSolvedHeuristicSearch]);

   const setHandlerNumber = (rowIndex: number, colIndex: number, value=number) => {
      if (value == 0) return

      let setValue = value;

      const elm = document.getElementById(`row-${rowIndex}-col-${colIndex}`);
      if (elm != null) {
         const oldValue = parseInt(elm.textContent!);
         if (oldValue == value) {
            elm.textContent = "";
            setValue = -1;
         } else {
           elm.textContent = setValue.toString(); 
         }
      }

      setBoardCurrent(prevList => {
         const newList = prevList.map((row, rIndex) => {
            if (rIndex === rowIndex) {
               return row.map((item, cIndex) => {
                     return cIndex === colIndex ? setValue : item;
               });
            }
            return row;
         });

         checkBoard(newList, true);
         return newList; 
      });
   }

   const checkBoard = (boardTarget=boardCurrent, checkEnd=false) => {
      let count = 0;
      let wrong = 0;
      
      for (let row = 0; row < 9; row++) {
         for (let col = 0; col < 9; col++) {
            if (board[row][col] == -1) {
               const value = boardTarget[row][col]
               if (value == -1) {
                  count++;
                  continue;
               }

               const elm = document.getElementById(`row-${row}-col-${col}`);
               if (elm == null) continue;

               const equal = value == boardBlindSearch[row][col];
               
               if (checkEnd) {
                  if (!equal) wrong++;
                  continue;
               }

               if (!equal) {
                  elm.style.backgroundColor  = "#ffa1ad";
                  wrong++;
               } else {
                  elm.style.backgroundColor  = "#5ee9b5";
               }
               setTimeout(() => {
                  elm.style.backgroundColor = "#fff";
               }, 1000)
            }
         }
      }
      if (count + wrong == 0) setIsEndGame(true);
   }

   const hint = () => {
      if (countHint == 0) return;

      for (const rowIndex of getListRandom()) {
         const row = boardCurrent[rowIndex];
         if (row.includes(-1)) { 
            const colIndex = row.indexOf(-1);

            const value = boardHeuristicSearch[rowIndex][colIndex];
            setHandlerNumber(rowIndex, colIndex, value);
            
            setCountHint(countHint - 1);
            return;
         }
      }
   }

   // --------------------- service function ------------------------------------

   const formatTime = (time: number): string => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
   };

   const getListRandom = () => {
      const arr = Array.from({ length: 9 }, (_, i) => i);
      
      for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
   }

   return (
      <>
         <div className='start-container'>
            <div className='w-[80%] aspect-[4/2.8] py-20 px-10 flex gap-4 max-xl:w-[90%] max-xl:px-2 max-lg:w-[98%]'>

               <div className='w-[34%] max-lg:w-[38%] h-[95%] bg-white/40 flex flex-col items-center gap-4 max-xl:gap-2 max-md:gap-0 py-4 rounded-xl'>
                  <section className='section-detail'>
                     <div className='w-[70%] flex items-center gap-1'>
                        <UilStopwatch className="option-icon fill-neutral-700" />
                        <h4 className='text-neutral-700 font-semibold'>Time</h4>
                     </div>
                     <div className='w-[70%] flex justify-between'>
                        <button 
                           onClick={() => setIsRunning(!isRunning)} 
                           className='shadow-box w-[23%] aspect-square flex justify-center items-center hover:bg-white/40 hover:fill-white/95 duration-300'
                        >
                           {isRunning ? <UilPause className="option-icon" /> : <UilPlay className="option-icon" />}
                        </button>
                        <h2 className='shadow-box px-3 w-[74%] text-black flex justify-center items-center'>{formatTime(time)}</h2>
                     </div>
                  </section>

                  <section className='section-detail'>
                     <div className='w-[70%] flex items-center gap-1 mt-4 max-lg:mt-2 max-md:mt-1'>
                        <UilTachometerFastAlt className="option-icon fill-neutral-700" />
                        <h4 className='text-neutral-700 font-semibold'>Game Difficulty</h4>
                     </div>
                     <div className='shadow-box w-[70%] bg-white/80 flex justify-center items-center py-2'>
                        <h3 className='text-black'>{level == 1 ? "Easy" : (level == 2 ? "Medium" : "Hard")}</h3>
                     </div>
                  </section>

                  <section className='section-detail'>
                     <div className='w-[70%] flex items-center gap-1 mt-4 max-lg:mt-2 max-md:mt-1'>
                        <UilBars className="option-icon fill-neutral-700" />
                        <h4 className='text-neutral-700 font-semibold'>Option</h4>
                     </div>

                     <div className='w-[70%] flex justify-between'>
                        <button 
                           onClick={() => checkBoard()}
                           className='shadow-box w-[30%] aspect-square text-black text-sm font-bold flex flex-col justify-center items-center hover:bg-white/40 hover:text-white/95 hover:fill-white/95 duration-300'
                        >
                           <UilCheckCircle className="option-icon" />
                           <h5>Check</h5>
                        </button>
                        <button 
                           onClick={() => setShowReStart(true)}
                           className='shadow-box w-[30%] aspect-square text-black text-sm font-bold flex flex-col justify-center items-center hover:bg-white/40 hover:text-white/95 hover:fill-white/95 duration-300'
                        >
                           <UilRedo className="option-icon" />
                           <h5>Restart</h5>
                        </button>
                        <button 
                           onClick={hint}
                           className='shadow-box w-[30%] relative aspect-square text-black text-sm font-bold flex flex-col justify-center items-center hover:bg-white/40 hover:text-white/95 hover:fill-white/95 duration-300'
                        >
                           <UilLightbulbAlt className="option-icon" />
                           <h5>Hint</h5>
                           <div className='notification'><p>{countHint}</p></div>
                        </button>
                     </div>
                  </section>

                  <section className='section-detail'>
                     <div className='w-[70%] flex items-center gap-1 mt-4 max-lg:mt-2 max-md:mt-1'>
                        <UilPuzzlePiece className="option-icon fill-neutral-700" />
                        <h4 className='text-neutral-700 font-semibold'>Solved Puzzle</h4>
                     </div>
                     <button
                        onClick={() => setShowSolvedBlindSearch(true)} 
                        className='shadow-box w-[70%] bg-white/80 flex justify-center items-center py-2 text-black hover:text-white hover:bg-white/40 duration-300'
                     >
                        <h4>Blind Search </h4>
                     </button>
                     <button
                        onClick={() => setShowSolvedHeuristicSearch(true)} 
                        className='shadow-box w-[70%] bg-white/80 flex justify-center items-center py-2 text-black hover:text-white hover:bg-white/40 duration-300'
                     >
                        <h4>Heuristic Search</h4>
                     </button>
                  </section>
               </div>

               <div className='w-[64%] h-full flex flex-col items-center justify-start gap-3'>
                  <div className="h-[85%] w-[100%] flex justify-center">
                     <div className='board w-[80%] max-xl:w-[85%] max-lg:w-[90%] max-md:w-[95%] bg-black border grid grid-rows-9 rounded-md overflow-hidden'>
                        {board.map((rows, rowIndex) => 
                           <div className='fill-rows' key={`row-${rowIndex}`}>
                              {rows.map((col, colIndex) => 
                                 <React.Fragment key={`col-${colIndex}`}>
                                 {col == -1 ? (
                                    <div className='fill text-xl' id={`row-${rowIndex}-col-${colIndex}`} onClick={() => setHandlerNumber(rowIndex, colIndex)}></div>
                                 ) : (
                                    <div className='lock fill text-xl'>{col}</div>
                                 )}
                                 </React.Fragment>
                              )}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="h-[15%] w-[100%] flex justify-center">
                     <div className="selected w-[80%] max-xl:w-[85%] max-lg:w-[90%] max-md:w-[95%] aspect-[9/1] grid grid-cols-9 gap-2">
                        {size.map((num, i) => 
                           <React.Fragment key={`selected-number-${i}`}>
                              <input type="radio" id={`number-${num}`} name="num-selected" defaultChecked={num==1} />
                              <label className="number-selected" htmlFor={`number-${num}`} onClick={() => setNumber(num)}>
                                 <h3>{num}</h3>
                              </label>
                           </React.Fragment>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            
            {/* --------------------------------- action page modal --------------------------------- */}

            {!isRunning && ( <GamePause setIsRunning={setIsRunning} /> )}
            {showReStart && ( <Dialog setShowDialog={setShowReStart} /> )}
            {isEndGame && ( <GameSolved time={formatTime(time)} level={level} /> )}
            {showSolvedBlindSearch && (<SolvedBoard isBlind={true} board={board} steps={stepsBlindSearch as StepProps[]} showDialog={setShowSolvedBlindSearch} />)}
            {showSolvedHeuristicSearch && (<SolvedBoard isBlind={false} board={board} steps={stepsHeuristicSearch as StepProps[]} showDialog={setShowSolvedHeuristicSearch} />)}

         </div>
      </>
   )
}
export default Page