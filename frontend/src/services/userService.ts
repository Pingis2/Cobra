import { IUserData, IUsers } from "../models/IUsers";
import { get, post } from "./serviceBase";

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

export const getUser = async (token: string): Promise<IUserData | {error: boolean}> => {
    try {
        const response = await get<IUserData>(
            `${BASE_URL}get-user`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("api response", response);

        if (response.data && response.data.users) {
            return { users: response.data.users, token: token };
        } else {
            console.error("No user found in the response");
            return { error: true, token: '' };
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
    ): Promise<IUserData | null> => {
    try {
        const response = await post<{ success: boolean; user?: IUserData; message?: string; token: string; }>(
            `${BASE_URL}add-user`,
            {
                userName,
                firstName,
                lastName,
                email,
                password,
                country
            }
        );

        console.log("api response", response.data);
        
        if (response.data.success) {

            const token = response.data.token;
            if (token) {
                localStorage.setItem('authToken', token);
            }

            return response.data.user || null;
        } else {
            console.error("Registration failed:", response.data.message);
            return null; // Indicate failure
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}