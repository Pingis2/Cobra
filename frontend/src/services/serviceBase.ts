import axios from "axios";

export const get = async <T>(url: string, p0: { headers: { Authorization: string; }; }) => {
    try {
        console.log("api url", url)
        const response = await axios.get<T>(url, {
            headers: {
                'Content-Type': 'application/json',
                ...p0.headers,
            }
        });
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
        console.log("api url", url)
        const response = await axios.post<T>(url, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("api response", response);
        return response;
    } catch (error) {
        console.error("Error during API call:", error);
        throw error;
    }
}