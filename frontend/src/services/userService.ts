import { IUserData } from "../models/IUsers";
import { get, post } from "./serviceBase";

const BASE_URL = 'https://express-test-pearl.vercel.app/api/';

export const getUsers = async (): Promise<IUsersData[]> => {
    try {
        const response = await get<IUsersData>(
            `${BASE_URL}leaderboard`
        );

        console.log("api response", response);

        if (response.data && response.data.users) {
            return response.data.users;
        } else {
            console.error("No users found in the response");
            return [];
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string): Promise<IUserData | null> => {
    try {
        const response = await post<{ success: boolean; user?: IUserData; message?: string }>(
            `${BASE_URL}login`,
            { email, password }
        );

        console.log("api response", response.data);
        
        if (response.data.success) {
            return response.data.user || null;
        } else {
            console.error("Login failed:", response.data.message);
            return null; // Indicate failure
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};