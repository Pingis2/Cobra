import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import './styling/main.scss'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    
    <UserProvider>
        <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
