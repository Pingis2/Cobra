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

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            } 

            try {
                const data = await getLoggedInUser(token);
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            { children }
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);