import { useState } from "react";
import { logoutUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutSuccess, setLogoutSuccess] = useState<null | boolean>(null);
    const navigate = useNavigate();

    const logout = async () => {
        const token = localStorage.getItem("token"); // or get the token from your auth state or context

        if (!token) {
            console.error("No token found, user is not logged in.");
            setLogoutSuccess(false);
            return;
        }

        setIsLoggingOut(true);

        try {
            const success = await logoutUser(token);

            if (success) {
                localStorage.removeItem("token"); 
                setLogoutSuccess(true);
                navigate('/login');
            } else {
                setLogoutSuccess(false);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutSuccess(false);
        }

        setIsLoggingOut(false);
    };

    return (
        <>
            <div className="logout-button">
                <button onClick={logout} disabled={isLoggingOut}>
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