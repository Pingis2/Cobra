import React, { createContext, useContext, useEffect, useState } from "react";
import { IUsers } from "../models/IUsers";
import { getLoggedInUser } from "../services/userService";

export interface IUserContext {
    user: IUsers | null;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUsers | null>>;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    loading: true,
    setUser: () => {},
});


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUsers | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const retryGetUser = async (token:string, retries: number = 15, delay: number = 1000) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await getLoggedInUser(token);
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
        const fetchUserData = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            } 

            try {
                const data = await retryGetUser(token);
                if (data) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (location.pathname !== "/" || "create-user") {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [location.pathname]);

    return (
        <>
            {loading? (
                <div>Fetching user data <span className="dots"></span></div>
            ):(
                <UserContext.Provider value={{ user, loading, setUser }}>
                    { children }
                </UserContext.Provider>
            )}
        </>
    );
        
};

export const useUser = () => useContext(UserContext);
