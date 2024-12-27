import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import './styling/main.scss'
import { UserProvider } from './context/UserContext'
//import { AppLoader } from './pages/Loader'

function App() {
  return (
    
    <UserProvider>
      {/*<AppLoader>*/}
        <RouterProvider router={router} />
      {/*</AppLoader>*/}
    </UserProvider>
  )
}

export default App
