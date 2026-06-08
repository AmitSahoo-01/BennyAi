import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { authRouter } from './app.routes.jsx';


const App = () => {
  return (
    <>
      <RouterProvider router={authRouter} />
    </>
  )
}

export default App