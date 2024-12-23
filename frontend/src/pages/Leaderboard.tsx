import { useEffect, useState } from "react";
import { IUserData } from "../models/IUsers";
import { getUsers } from "../services/userService";

export const Leaderboard = () => {
    const [backendData, setBackendData] = useState<IUserData>({})

    useEffect(() => {

        getUsers()
            .then((data) => {
                setBackendData({ users: data.users });
            })
            .catch((error) => {
                console.error("Error during API call:", error);
                setBackendData({ error: true });
            });
    }, []);

    return (
        <>
            <div>
                {backendData.error ? (
                    <p>Error loading users</p>
                ) : !backendData.users ? (
                    <p>Loading...</p>
                ) : (
                    backendData.users.map((user) => (
                        <p key={user._id}>
                            {user.userName}, {user._id}
                        </p>
                    ))
                )}
            </div>
        </>
    )
}

