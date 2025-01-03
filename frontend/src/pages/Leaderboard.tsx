import { useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";
import { BackButton } from "../components/BackButton";
import FirstPlace from "../assets/images/leaderboard-podium/first-place.png";
import SecondPlace from "../assets/images/leaderboard-podium/second-place.png";
import ThirdPlace from "../assets/images/leaderboard-podium/third-place.png";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";
import LogoutButton from "../components/Logout";
import { useUser } from "../context/UserContext";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            getUsers(token)
                .then((data) => {
                    if (data.error) {
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
            console.error("No token found in localStorage");
            setError(true);
        }
    }, []);

    const countryImage = (user: IUsers) => {
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
                <BackButton />
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && countryImage(user)}</p>
                    <LogoutButton />
                </div>
            </header>
            
            
            <div className="podium">
                {backendData === null ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="podium-top">
                            <ul>
                                {backendData.slice(1, 2).map((user) => (
                                    <li key={user._id} className="second-place">
                                        <div className="second-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            {countryImage(user)}
                                        </div>
                                        <img src={SecondPlace} alt="Second place podium" className="podium-image" />
                                    </li>
                                ))}
                                {backendData.slice(0, 1).map((user) => (
                                    <li key={user._id} className="first-place">
                                        <div className="first-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            {countryImage(user)}
                                        </div>
                                        <img src={FirstPlace} alt="First place podium" />
                                    </li>
                                ))}
                                {backendData.slice(2, 3).map((user) => (
                                    <li key={user._id} className="third-place">
                                        <div className="third-place-user">
                                            <p className="username">{user.userName}</p>
                                            <p>{user.highscore}</p>
                                            {countryImage(user)}
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
                                        {backendData.slice(3).map((user, index) => (
                                            <li key={`rank-${user._id}`}>
                                                <p>{index + 4}</p>
                                            </li>
                                        ))}
                                    </li>

                                    <li>
                                        <p>Name</p>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`name-${user._id}`}>
                                                <p>{user.userName}</p>
                                            </li>
                                        ))}
                                    </li>

                                    <li>
                                        <p>Score</p>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`score-${user._id}`}>
                                                <p>{user.highscore}</p>
                                            </li>
                                        ))}
                                    </li>

                                    <li>
                                        <p>Country</p>
                                        {backendData.slice(3).map((user) => (
                                            <li key={`country-${user._id}`}>
                                                {countryImage(user)}
                                            </li>
                                        ))}
                                    </li>
                                </ul>
                            </div>
                        
                    </>
                )}
            </div>
        </>
    )
}

