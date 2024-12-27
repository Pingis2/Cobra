import { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }
    

    //localStorage.removeItem("token");
    

    let handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            const data = await loginUser(email, password);
            console.log("login result", data);
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                if (data.users && data.users.length > 0) {
                    setUser(data.users[0]);
                } else {
                    setError("No users found in response");
                }
                navigate("/start-page");
            } else {
                setError("Wrong email or password");
            }
        } catch (error: any) {
            console.error("Error during login:", error);
            if (error.response) {
                // Handle specific HTTP errors
                if (error.response.status === 404) {
                    setError("User not found");
                } else if (error.response.status === 401) {
                    setError("Invalid password");
                } else {
                    setError("An error occurred during login");
                }
            } else {
                setError("Network or server error");
            }
        }
    }

    return (
        <>
            <section className="login-container">
                <h2>Log in to your account</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {error && <p>{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            

                <p onClick={() => handleNavigation('/create-account')} className="create-account">Don't have an account? Click to create one</p>
            </section>
        </>
    );
}

export default Login;