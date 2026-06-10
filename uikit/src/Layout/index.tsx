import React from 'react'

import '../index.css'

const Layout = ({children}) => {
  return (
    <div className="h-full p-sm flex flex-col min-w-[1000px] overflow-y-auto">
      <div className="flex-1 w-full bg-white">{children}</div>
    </div>
  )
}

export default Layout
