import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LogoutButton from "../components/Logout";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";


export const Results = () => {
    const { user } = useUser();
    console.log(user?.latestScore);
    console.log(user?.highscore);
    
    
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
                <h2>Results</h2>
                <div className="result-score">
                    <p>latest score: {user?.latestScore}</p>
                    <p>Highscore: {user?.highscore}</p>
                </div>
                <div className="nav-buttons">
                    <button onClick={() => handleNavigation("/game")} type="button">Play again</button>
                    <button onClick={() => handleNavigation("/start-page")} type="button">Back to home</button>
                </div>
            </div>
        </>
    )
}