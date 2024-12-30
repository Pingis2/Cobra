import { useContext } from "react";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


export const StartGamePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>

            <header>
                    <LogoutButton />
                    <p className="user-info">{user?.firstName} {user?.country}</p>
            </header>

            <div>
                <h1>Start Game</h1>
                <p>Click the button below to start the game.</p>
                <button type="button" onClick={() => handleNavigation("/game-page")}>Start Game</button>
                <button type="button" onClick={() => handleNavigation("/start-page")}>Back to Home</button>
            </div>
        </>
    );
}