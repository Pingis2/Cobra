import { useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";
import { BackButton } from "../components/BackButton";
import FirstPlace from "../assets/images/leaderboard-podium/first-place.png";
import SecondPlace from "../assets/images/leaderboard-podium/second-place.png";
import ThirdPlace from "../assets/images/leaderboard-podium/third-place.png";
import LogoutButton from "../components/Logout";
import { useUser } from "../context/UserContext";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);
    const { user } = useUser();

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

    return (
        <>
            <header className="header-with-back-button">
                <BackButton />
                <div className="user-logout">
                    <p
                        className="user-info">
                        {user?.userName}
                        {user && <CountryFlag user={user} />}
                    </p>
                    <LogoutButton />
                </div>
                <Jungle />
            </header>
            
            
            <div className="podium">
                {backendData === null ? (
                    <p className="loading-text">Loading<span className="dots"></span></p>
                ) : (
                    <>
                        <div className="podium-top">
                            <ul>
                                {backendData.slice(1, 2).map((user) => (
                                    <li key={user._id} className="second-place">
                                        <div className="second-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            <CountryFlag user={user} />
                                        </div>
                                        <img src={SecondPlace} alt="Second place podium" className="podium-image" />
                                    </li>
                                ))}
                                {backendData.slice(0, 1).map((user) => (
                                    <li key={user._id} className="first-place">
                                        <div className="first-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            <CountryFlag user={user} />
                                        </div>
                                        <img src={FirstPlace} alt="First place podium" className="podium-image"/>
                                    </li>
                                ))}
                                {backendData.slice(2, 3).map((user) => (
                                    <li key={user._id} className="third-place">
                                        <div className="third-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            <CountryFlag user={user} />
                                        </div>
                                        <img src={ThirdPlace} alt="Third place podium" className="podium-image"/>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="other-users">
                            <ul className="user-data-list">
                                <li>
                                    <p>Rank</p>
                                    <ul>
                                        {backendData.slice(3).map((user, index) => (
                                            <li key={`rank-${user._id}`}>
                                                <p>{index + 4}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="user-name">
                                    <p>Name</p>
                                    <ul>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`name-${user._id}`}>
                                                <p>{user.userName}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li>
                                    <p>Score</p>
                                    <ul>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`score-${user._id}`}>
                                                <p>{user.highscore}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li>
                                    <p>Country</p>
                                    <ul>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`country-${user._id}`}>
                                                <CountryFlag user={user} />
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        
                    </>
                )}
            </div>
        </>
    )
}

