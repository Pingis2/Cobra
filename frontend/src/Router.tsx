import { createBrowserRouter } from "react-router-dom";
import { Leaderboard } from "./pages/Leaderboard";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { StartPage } from "./pages/Start";
import { CreateUser } from "./pages/CreateUser";
import { StartGamePage } from "./pages/StartGame";
import { Game } from "./pages/Game";
import { Results } from "./pages/Results";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Login />,
            },
            {
                path: "/leaderboard",
                element: <Leaderboard />,
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
                path: "/start-game",
                element: <StartGamePage />,
            },
            {
                path: "/game",
                element: <Game />,
            },
            {
                path: "/results",
                element: <Results />,
            },
            {
                path: "/privacy-policy",
                element: <PrivacyPolicy />,
            }
        ]
    }
])