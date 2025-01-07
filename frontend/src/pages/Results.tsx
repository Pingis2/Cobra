import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LogoutButton from "../components/Logout";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";

const formatTime = (timeInSeconds: number | undefined): string => {
    if (timeInSeconds === undefined) return "N/A";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const Results = () => {
    const { user } = useUser();
    
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const countryImage = () => {
        if (user?.country === "England") {
            return <img src={EnglandFlag} alt="England flag" className="user-country" />;
        } else if (user?.country === "Sweden") {
            return <img src={SwedenFlag} alt="Sweden flag" className="user-country" />;
        } else if (user?.country === "USA") {
            return <img src={AmericanFlag} alt="USA flag" className="user-country" />;
        }
    }
    
    const formattedTime = formatTime(user?.timer);

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {countryImage()}</p>
                    <LogoutButton />
                </div>
            </header>
            <div>
                <h1>Game over</h1>
                <section className="results-container">
                    <h2>Results: </h2>
                    <ul className="results">
                        <li>Score: {user?.latestScore}</li>
                        <li>Time: {formattedTime}</li>
                        <li>Highscore: {user?.highscore}</li>
                    </ul>
                </section>
                <div className="nav-buttons">
                    <button onClick={() => handleNavigation("/game")} type="button">Play again</button>
                    <button onClick={() => handleNavigation("/start-page")} type="button">Back to home</button>
                </div>
            </div>
        </>
    )
}