import React, { useEffect, useRef, useState } from 'react'

import { UilRedo, UilPlay, UilPause, UilMultiply } from '@iconscout/react-unicons';

const SolvedBoard = ({ isBlind, board, steps, showDialog }: SolveBoardProps) => {
   const duration = 100;

   const [isSet, setIsSet] = useState<boolean>(false);
   const [isStart, setIsStart] = useState<boolean>(false);
   const [isFinished, setIsFinished] = useState<boolean>(false);

   const [countStep, setCountStep] = useState<number>(0);
   const [finalStep, setFinalStep] = useState<number>(0);

   const [initialSteps, setInitialSteps] = useState<StepProps[]>([]);

   const divRef = useRef<HTMLDivElement>(null);
   const [isOdd, setIsOdd] = useState<boolean>(false);

   useEffect(() => {
      if (!isSet) {
         setInitialSteps(steps);
         setFinalStep(steps.length || 0);
         setIsSet(true);
      }

      if (!isStart || isFinished) return;

      const nextStep = setInterval(() => {
         const item = initialSteps[countStep];
         addElement(item);

         const elm = document.getElementById("table-step");
         if (elm) elm.scrollTo(0, elm.scrollHeight);

         setBoard(item);

         const nextStep = countStep + 1;
         setCountStep(nextStep);

         if (nextStep == finalStep) {
            setIsStart(false);
            setIsFinished(true);
         }

      }, duration);

      return () => clearInterval(nextStep);

   }, [isSet, isStart, isFinished, initialSteps, countStep, finalStep]);

   const play = () => {
      if (isFinished) {
         restart()
      }
      setIsStart(!isStart)
   }

   const restart = () => {
      setIsStart(false);
      setCountStep(0);
      setIsFinished(false);

      const div = document.getElementById("table-step");
      if (div) {
         div.innerHTML = "";
      }

      const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.fill.not-lock');

      elements.forEach(elm => {
         elm.textContent = "";
         elm.style.backgroundColor = "#fff";
     });
   }

   const setBoard = (item: StepProps) => {
      const action = item.action;
      const [rowIndex, colIndex] = item.position;
      const elm = document.getElementById(`solved-row-${rowIndex}-col-${colIndex}`);
      
      if (elm != null) {
         elm.textContent = item.number.toString();
         if (isBlind) {
            elm.style.backgroundColor = action == "place" ? "#5ee9b5" : "#ffa1ad";
         } else {
            elm.style.backgroundColor = action == "H backtrack" ? "#ffa1ad" : "#5ee9b5";
         }
      }
   }

   const addElement = (item: StepProps) => {
      if (divRef.current) {
        const newElement = document.createElement("div");
        newElement.className = `grid grid-cols-9 text-black ${isOdd ? "bg-neutral-200" : ""}`;

        newElement.innerHTML= `
         <h5 class='col-span-2 border-r border-black'>${countStep + 1}</h5>
         <h5 class='border-r border-black'>${item.position[0] + 1}</h5>
         <h5 class='border-r border-black'>${item.position[1] + 1}</h5>
         <h5 class='col-span-2'>${item.number}</h5>
         <h5 class='col-span-3'>${item.action}</h5>
        `

        divRef.current.appendChild(newElement);

        setIsOdd(!isOdd);
      }
    };

   return (
      <div className='w-full h-screen absolute top-0 left-0 grid place-items-center bg-white/10 backdrop-blur-md'>
         <div className='absolute top-0 left-0 pt-2 pl-2'>
            <h4>Solved By {isBlind ? "Blind" : "Heuristic"} Search</h4>
         </div>
         <div onClick={() => showDialog(false)} className='absolute top-0 right-0 pt-3 pr-3 cursor-pointer fill-white hover:fill-black/20 duration-300'>
            <UilMultiply size="30" />
         </div>
         <div className='w-[70%] max-xl:w-[80%] max-md:w-[74%] aspect-[10/7] gap-3 max-xl:gap-2 max-md:gap-1 flex'>
            <div className='w-[30%] flex flex-col gap-3 max-lg:gap-2 max-md:gap-1'>
               <div className='w-full aspect-[11/3] flex gap-3 max-xl:gap-2 max-md:gap-1 text-black font-bold'>
                  <div className='btn-solved-restart' onClick={() => restart()}>
                     <UilRedo className="option-icon-mid"/>
                     <h4>Reset</h4>
                  </div>
                  <div className='btn-solved-toggle' onClick={() => play()}>
                     {isStart ? (
                        <><UilPause className="option-icon-large" /> <h3>Stop</h3></>
                     ): (
                        <><UilPlay className="option-icon-large" /> <h3>Start</h3></>
                     )}
                  </div>
               </div>
               <div className='w-full h-full flex flex-col gap-2 bg-white rounded-xl text-center text-black p-2 overflow-hidden'>
                  <h4>Steps</h4>
                  <section className='w-full h-full overflow-hidden'>
                     <div className='grid grid-cols-9 bg-black text-white py-1'>
                        <h5 className='col-span-2'>No</h5>
                        <h5>row</h5>
                        <h5>col</h5>
                        <h5 className='col-span-2'>number</h5>
                        <h5 className='col-span-3'>action</h5>
                     </div>
                     <div ref={divRef} id="table-step" className='w-full h-[95%] pb-1 overflow-auto'></div>
                  </section>
               </div>
            </div>
            <div className='w-[70%] aspect-square bg-white rounded-xl'>
               <div className='board w-full h-full bg-black border grid grid-rows-9 rounded-md overflow-hidden'>
                  {board.map((rows, rowIndex) => 
                     <div className='fill-rows' key={`row-${rowIndex}`}>
                        {rows.map((col, colIndex) => 
                           <React.Fragment key={`col-${colIndex}`}>
                           {col == -1 ? (
                              <div className='fill not-lock text-2xl max-lg:text-xl' id={`solved-row-${rowIndex}-col-${colIndex}`}></div>
                           ) : (
                              <div className='fill lock text-2xl max-lg:text-xl'>{col}</div>
                           )}
                           </React.Fragment>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
export default SolvedBoard
