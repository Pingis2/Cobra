import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LogoutButton from "../components/Logout";
import { CountryFlag } from "../components/CountryFlag";

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
    
    const formattedTime = formatTime(user?.timer);

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
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