import { IUserData } from "../models/IUsers";
import { get } from "./serviceBase";

const BASE_URL = 'https://express-test-pearl.vercel.app/';

export const getUsers = async (): Promise<IUserData> => {
    try {
        const respone = await get<IUserData>(
            `${BASE_URL}users`
        );

        return respone.data;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};