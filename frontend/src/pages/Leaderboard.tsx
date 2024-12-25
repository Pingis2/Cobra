import { useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getUsers } from "../services/userService";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUsers[] | null>(null);
    const [, setError] = useState(false);

    useEffect(() => {
        getUsers()
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

