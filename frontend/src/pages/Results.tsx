import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LogoutButton from "../components/Logout";


export const Results = () => {
    const { user } = useUser();
    console.log(user?.latest_score);
    
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }
    

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.firstName} {user?.country}</p>
                    <LogoutButton />
                </div>
            </header>
            <div>
                <h1>Game over</h1>
                <h2>Results</h2>
                <div className="score">
                    <p>latest score: {user?.latest_score}</p>
                    <p>Highscore: {user?.highscore}</p>
                </div>
                <div className="nav-buttons">
                    <button onClick={() => handleNavigation("/game-page")} type="button">Play again</button>
                    <button onClick={() => handleNavigation("/start-page")} type="button">Back to home</button>
                </div>
            </div>
        </>
    )
}