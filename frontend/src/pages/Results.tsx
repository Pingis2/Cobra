import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LogoutButton from "../components/Logout";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";
import { useState, useEffect } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";

const formatTime = (timeInSeconds: number | undefined): string => {
    if (timeInSeconds === undefined) return "N/A";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const Results = () => {
    const { user } = useUser();
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);
    
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

     
    
        const retryFetchUsers= async (token: string, retries: number = 15, delay: number = 2000) => {
                for (let attempt = 0; attempt < retries; attempt++) {
                    try {
                        const response = await getUsers(token);
                        return response; // Successful login
                    } catch (error) {
                        if (attempt < retries - 1) {
                            console.error(`Retrying login (${attempt + 1}/${retries})...`);
                            await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
                        } else {
                            throw error; // Throw error after max retries
                        }
                    }
                }
            };
    
        useEffect(() => {
            const token = sessionStorage.getItem('token');
    
            if (token) {
                retryFetchUsers(token)
                    .then((data) => {
                        if (!data || data.error) {
                            setError(true);
                        } else {
                            const sortedUsers = (data.users || []).sort((a, b) => b.highscore - a.highscore);
                            setBackendData(sortedUsers);
                        }
                    })
                    .catch((error) => {
                        console.error("Error during API call:", error);
                        setError(true);
                    });
            } else {
                console.error("No token found in sessionStorage");
                setError(true);
            }
        }, []);
    
    const formattedTime = formatTime(user?.timer);

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                    <LogoutButton />
                </div>
                <Jungle />
            </header>
            <div>
                <h1>Game over</h1>
                <div className="results-leaderboard">
                    <section className="results-container">
                        <h2>Results: </h2>
                        <ul className="results">
                            <li>Score: {user?.latestScore}</li>
                            <li>Time: {formattedTime}</li>
                            <li>Highscore: {user?.highscore}</li>
                        </ul>
                    </section>
                    <section className="leaderboard-container">
                        <h2>Top 5 leaderboard</h2>
                        {backendData === null ? (
                            <p className="loading-text">Loading<span className="dots"></span></p>
                        ) : (
                            <ol className="leaderboard">
                                <li className="user">{backendData[0]?.userName} - {backendData[0]?.highscore}</li>
                                <li className="user">{backendData[1]?.userName} - {backendData[1]?.highscore}</li>
                                <li className="user">{backendData[2]?.userName} - {backendData[2]?.highscore}</li>
                                <li className="user">{backendData[3]?.userName} - {backendData[2]?.highscore}</li>
                                <li className="user">{backendData[4]?.userName} - {backendData[2]?.highscore}</li>
                            </ol>
                        )}
                    </section>
                </div>
                <div className="nav-buttons">
                    <button onClick={() => handleNavigation("/game")} type="button">Play again</button>
                    <button onClick={() => handleNavigation("/start-page")} type="button">Back to home</button>
                </div>
            </div>
        </>
    )
}