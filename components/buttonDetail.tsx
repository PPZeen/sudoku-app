import React from 'react'

const ButtonDetail = ({ action, childen, title }: { action: any, childen: any, title: string }) => {
   return (
      <button 
         onClick={() => action()}
         className='shadow-box w-[30%] aspect-square text-black text-sm font-bold flex flex-col justify-center items-center hover:bg-white/40 hover:text-white/95 hover:fill-white/95 duration-300'
      >
         { childen }
         <h5>{title}</h5>
      </button>
   )
}

export default ButtonDetail