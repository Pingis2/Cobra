import axios from "axios";

export const get = async <T>(url: string) => {
    try {
        console.log("api url", url)
        const response = await axios.get<T>(url);
        console.log("api response", response);
        
        
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};

export const post = async <T>(url: string, data: any) => {
    try {
        const response = await axios.post<T>(url, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}