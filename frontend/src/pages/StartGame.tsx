import { useContext } from "react";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";


export const StartGamePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const countryImage = () => {
        if (user?.country === "England") {
            return <img src={EnglandFlag} alt="England flag" className="user-country" />;
        } else if (user?.country === "Sweden") {
            return <img src={SwedenFlag} alt="Sweden flag" className="user-country" />;
        } else if (user?.country === "USA") {
            return <img src={AmericanFlag} alt="USA flag" className="user-country" />;
        }
    }

    return (
        <>
            <header className="header-with-back-button">
                <div className="back-button">
                    <BackButton />
                </div>
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {countryImage()}</p>
                    <LogoutButton />
                </div>
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