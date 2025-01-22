import { useState } from "react";
import { logoutUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutSuccess, setLogoutSuccess] = useState<null | boolean>(null);
    const navigate = useNavigate();

    const retryLogout = async (retries: number = 15, delay: number = 2000, token: string) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await logoutUser(token);
                return response; // Successful logout
            } catch (error) {
                if (attempt < retries - 1) {
                    console.error(`Retrying logout (${attempt + 1}/${retries})...`);
                    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
                } else {
                    throw error; // Throw error after max retries
                }
            }
        }
    }

    const handleLogout = async () => {
        const token = sessionStorage.getItem("token"); // or get the token from your auth state or context

        if (!token) {
            console.error("No token found, user is not logged in.");
            setLogoutSuccess(false);
            return;
        }

        setIsLoggingOut(true);

        try {
            const success = await retryLogout(15, 2000, token);

            if (success) {
                sessionStorage.removeItem("token");
                setLogoutSuccess(true);
                navigate('/');
            } else {
                setLogoutSuccess(false);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutSuccess(false);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const startLogoutProcess = () => {
        const inteervalId = setInterval(async () => {
            try {
                await handleLogout();
                clearInterval(inteervalId);
            } catch (error) {
                console.error("Error during logout process:", error);
            }
        }, 2000);
    }

    return (
        <>
            <div className="logout-button">
                <button onClick={startLogoutProcess} disabled={isLoggingOut}>
                    {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
                {logoutSuccess !== null && (
                    <p>{logoutSuccess ? "Successfully logged out!" : "Logout failed. Please try again."}</p>
                )}
            </div>
        </>
    )
}

export default LogoutButton;