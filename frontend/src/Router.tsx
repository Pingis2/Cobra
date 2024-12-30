import { createBrowserRouter } from "react-router-dom";
import { Leaderboard } from "./pages/Leaderboard";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import StartPage from "./pages/Start";
import { CreateUser } from "./pages/CreateUser";
import { StartGamePage } from "./pages/StartGame";
import { Game } from "./pages/Game";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/leaderboard",
                element: <Leaderboard />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/start-page",
                element: <StartPage />,
            },
            {
                path: "/create-account",
                element: <CreateUser />,
            },
            {
                path: "/start-game-page",
                element: <StartGamePage />,
            },
            {
                path: "/game-page",
                element: <Game />,
            }
        ]
    }
])