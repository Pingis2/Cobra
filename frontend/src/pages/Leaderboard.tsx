import { useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";
import { BackButton } from "../components/BackButton";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (token) {
            // Pass the token to the getUsers function
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

    return (
        <>
            <BackButton />
            
            <div>
                {backendData === null ? (
                    <p>Loading...</p>
                ) : (
                    backendData.map((user) => (
                        <p key={user._id}>
                            {user.userName}, {user.highscore}, {user.country}
                        </p>
                    ))
                )}
            </div>
        </>
    )
}

