import React, { Dispatch } from 'react'

import { UilPlay} from '@iconscout/react-unicons';

const GamePause = ({setIsRunning} : {setIsRunning : Dispatch<React.SetStateAction<boolean>>}) => {
  return (
   <div className='wrapper gap-20 items-center absolute top-0 left-0 bg-white/10 backdrop-blur-md'>
      <div 
         onClick={() => setIsRunning(true)} 
         className='flex flex-col justify-center items-center cursor-pointer text-black gap-4 hover:text-white/60 hover:fill-white/60 duration-300'
      >
         <UilPlay size="80" />
         <h2>CONTINUE</h2>
      </div>
   </div>
  )
}

export default GamePause