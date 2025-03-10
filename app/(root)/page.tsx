"use client"

import Dialog from "@/components/dialog"

import { useState } from "react"

export default function Home() {
  const [showStart, setShowStart] = useState(false);

  return (
    <div className="wrapper">
      <div className="w-[40%] flex flex-col items-center justify-start gap-14">
        <h1 className="text-8xl mt-40 drop-shadow-lg">Sudoku</h1>
        <button onClick={() => setShowStart(true)} className="btn-start">PLAY</button>
      </div>

      {showStart && (
        <Dialog setShowDialog={setShowStart} />
      )}
    </div>
  )
}