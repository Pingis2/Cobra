import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import './styling/main.scss'

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
