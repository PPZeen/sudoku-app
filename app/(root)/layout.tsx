import React, { Suspense } from 'react'

export default function Layout ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <Suspense>
        { children }
      </Suspense>
    </main>
  )
}