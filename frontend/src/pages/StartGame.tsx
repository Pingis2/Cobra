import { useContext } from "react";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";


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
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                    <LogoutButton />
                </div>
                <Jungle />
            </header>

            <div className="instructions-container">
                <h1>Cobra</h1>
                <p className="instructions-1">Normal snake rules apply</p>
                <p className="instructions-2">Use the arrow keys or "W, A, S, D" to move the snake. <br></br> If on mobile you can swipe the screen or use the buttons below</p>
                <p className="instructions-3">Your score will be saved after the game is over</p>
                <p className="instructions-4">Click the button below to start the game.</p>
                <button type="button" onClick={() => handleNavigation("/game")}>Start Game</button>
            </div>
        </>
    );
}