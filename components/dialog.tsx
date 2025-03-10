"use client"

import { Dispatch, useState } from 'react';

import { UilMultiply } from '@iconscout/react-unicons'
import { UimStar } from '@iconscout/react-unicons-monochrome';

const Dialog = ({ setShowDialog }: { setShowDialog: Dispatch<React.SetStateAction<boolean>> }) => {
   const [level, setLevel] = useState(1);

   const start = () => {
      window.location.href = `/start?level=${level}`
   }

   return (
      <div className="wrapper  items-center absolute top-0 left-0 bg-white/10 backdrop-blur-md">
         <div className={`pb-4 w-[480px] rounded-xl bg-white`}>
            <div className="w-full p-2 flex justify-end">
               <button 
                  onClick={() => setShowDialog(false)} 
                  className="w-10 h-10 rounded-full bg-red-400 flex justify-center items-center"
               >
                  <UilMultiply size="22" color="#fff" />
               </button>
            </div>
            
            <h3 className='my-2 text-center text-black'>Select Difficulty Level</h3>

            <div className="level-option mt-6 w-full flex justify-center gap-2">
               <input type="radio" id="level-1" name="level" value={1} defaultChecked={true}/>
               <label className="level-card" htmlFor="level-1" onClick={() => setLevel(1)} >
                  <div className="mt-2 h-10 flex overflow-hidden">
                     <UimStar size="24" />
                  </div>
                  <h4>Easy</h4>
                  <div className="level-select"></div>
               </label>

               <input type="radio" id="level-2" name="level" value={2} />
               <label className="level-card" htmlFor="level-2" onClick={() => setLevel(2)}>
                  <div className="mt-2 h-10 flex overflow-hidden">
                     <UimStar size="24" />
                     <UimStar size="24" />
                  </div>
                  <h4>Medium</h4>
                  <div className="level-select"></div>
               </label>

               <input type="radio" id="level-3" name="level" value={3} />
               <label className="level-card" htmlFor="level-3" onClick={() => setLevel(3)}>
                  <div className="mt-2 h-10 flex overflow-hidden">
                     <UimStar size="24" />
                     <UimStar size="24" />
                     <UimStar size="24" />
                  </div>
                  <h4>Hard</h4>
                  <div className="level-select"></div>
               </label>
            </div>

            <div className='w-full mt-6 flex justify-center'>
               <button 
                  onClick={start} 
                  className='w-[40%] aspect-[11/3] bg-black rounded-md font-bold text-xl hover:bg-black/20 hover:text-black duration-300'
               >
                  START
               </button>
            </div>
         </div>
      </div>
   )
}
export default Dialog