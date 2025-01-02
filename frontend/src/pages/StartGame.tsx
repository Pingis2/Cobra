import { useContext } from "react";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";


export const StartGamePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            
            <header className="header-with-back-button">
                <div className="back-button">
                    <BackButton />
                </div>
                <div className="user-logout">
                    <p className="user-info">{user?.firstName} {user?.country}</p>
                    <LogoutButton />
                </div>
            </header>

            <div>
                <h1>Start Game</h1>
                <p>Click the button below to start the game.</p>
                <button type="button" onClick={() => handleNavigation("/game-page")}>Start Game</button>
            </div>
        </>
    );
}