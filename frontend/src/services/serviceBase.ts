import axios from "axios";

export const get = async <T>(url: string) => {
    try {
        const response = await axios.get<T>(url);
        return response;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
};

export const post = async <T>(url: string, data: any) => {
    try {
        const response = await axios.post<T>(url, data);
        return response;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}