import { IUserData, IUsers } from "../models/IUsers";
import { get, post, put } from "./serviceBase";

const BASE_URL = 'https://express-test-pearl.vercel.app/api/';

export const getUsers = async (token: string): Promise<IUserData> => {
    try {
        const response = await get<IUserData>(
            `${BASE_URL}leaderboard`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log("api response", response);

        if (response.data && response.data.users) {
            return { users: response.data.users, token: response.data.token };
        } else {
            console.error("No users found in the response");
            return { error: true, token: '' };
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};

export const getLoggedInUser = async (token: string): Promise<{ user: IUsers | null }> => {
    try {
        const response = await get<{ user: IUsers }>(
            `${BASE_URL}get-user`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("api response", response);

        if (response.data && response.data.user) {
            return { user: response.data.user };
        } else {
            console.error("No user found in the response");
            return { user: null };
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}


export const loginUser = async (email: string, password: string): Promise<IUserData | null> => {
    try {
        const response = await post<{ success: boolean; user?: IUsers[]; token?: string; message?: string }>(
            `${BASE_URL}login`,
            { email, password }
        );

        console.log("api response", response.data);
        
        if (response.data.success) {
            return {
                users: response.data.user || [],
                token: response.data.token || '',
            }
        } else {
            console.error("Login failed:", response.data.message);
            return null; // Indicate failure
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};

export const createUser = async (
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    country: string,
    highscore: number,
    latestScore: number
    ): Promise<IUserData | null> => {
    try {
        const response = await post<{ success: boolean; user?: IUserData; message?: string; }>(
            `${BASE_URL}add-user`,
            {
                userName,
                firstName,
                lastName,
                email,
                password,
                country,
                highscore,
                latestScore
            }
        );

        console.log("api response", response.data);
        
        if (response.data.success) {
            return response.data.user || null;
        } else {
            console.error("Registration failed:", response.data.message);
            return null;
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}

export const logoutUser = async (token: string): Promise<boolean> => { 
    try {
        const response = await post<{ success: boolean; message?: string }>(
            `${BASE_URL}logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("api response", response.data);
        
        if (response.data && response.data.success) {
            return true;
        } else {
            console.error("Logout failed:", response.data.message);
            return false;
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}

export const updateUserScore = async (token: string, highscore: number): Promise<IUserData | null> => {
    if (!token) {
        console.error("Token in missing");
        return null
    }

    try {
        const response = await put<{ success: boolean; user?: IUserData; message?: string }>(
            `${BASE_URL}update-user-score`,
            { highscore },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("api response", response.data);
        
        if (response.data.success) {
            return response.data.user || null;
        } else {
            console.error("Score update failed:", response.data.message);
            return null;
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}