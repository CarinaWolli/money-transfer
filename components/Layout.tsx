import React, { ReactNode } from "react"
import Header from "./Header"

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div className="px-2 sm:px-4 py-2.5 mt-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          {children}
        </div>
      </div>
    </div>
  )
}