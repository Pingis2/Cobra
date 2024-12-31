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
        <header>
            <LogoutButton />
            <p className="user-info">{user?.firstName} {user?.country}</p>
        </header>
        <div>
            <h1>Game over</h1>
            <h2>Results</h2>
            <p>Highscore: {user?.highscore}</p>
            <p>latest score: {user?.latest_score}</p>
            <div>
                
                <button onClick={() => handleNavigation("/game-page")} type="button">Play again</button>
                <button onClick={() => handleNavigation("/start-page")} type="button">Back to home</button>
            </div>
            </div>
        </>
    )
}