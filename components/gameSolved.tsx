import React from 'react'
import { useRouter } from 'next/navigation';

import { UilEstate, UilClockEight, UilTachometerFastAlt } from '@iconscout/react-unicons';
import { UimStar } from '@iconscout/react-unicons-monochrome';

const GameSolved = ({ time, level }: { time: string, level: number }) => {
   const router = useRouter();
   const difficulty = level == 1 ? "Easy" : (level == 2 ? "Medium" : "Hard");
   
   return (
      <div className='wrapper flex-col items-center gap-2 absolute top-0 left-0 bg-white/10 text-black backdrop-blur-2xl'>
         <div className='flex items-end gap-2'>
            <UimStar size="60" className="drop-shadow-xl fill-amber-400" />
            <UimStar size="80" className="drop-shadow-xl fill-amber-400" />
            <UimStar size="60" className="drop-shadow-xl fill-amber-400" />
         </div>
         <h1 className='tracking-wide'>CONGRATULATIONS!!</h1>
         <h3>You correctly solved the puzzle.</h3>
         <div className='my-10 w-[30%] grid grid-cols-10'>
            <div className='col-span-7'>
               <div className='flex gap-4 items-start'>
                  <UilTachometerFastAlt size="28" />
                  <h3>Difficulty:</h3>
               </div>
               <div className='mt-4 flex gap-4 items-start'>
                  <UilClockEight size="28" />
                  <h3>Time:</h3>
               </div>
            </div>
            <div className="col-span-3 text-center">
               <h3 className={level == 1 ? "text-green-600" : (level == 2 ? "text-amber-600" : "text-red-600")}>{difficulty}</h3>
               <h3 className='mt-4'>{time}</h3>
            </div>
         </div>
         <div 
            onClick={() => router.push('/')} 
            className='mt-10 flex flex-col justify-center items-center cursor-pointer gap-3 hover:text-white/60 hover:fill-white/60 duration-300'
         >
            <UilEstate size="60" />
            <h3>HOME</h3>
         </div>
      </div>   
  )
}

export default GameSolved