import { useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Get token from localStorage

        if (token) {
            // Pass the token to the getUsers function
            getUsers(token)
                .then((data) => {
                    if (data.error) {
                        setError(true);
                    } else {
                        setBackendData(data.users || []);
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
            <div>
                {backendData === null ? (
                    <p>Loading...</p>
                ) : (
                    backendData.map((user) => (
                        <p key={user._id}>
                            {user.userName}, {user._id}
                        </p>
                    ))
                )}
            </div>
        </>
    )
}

