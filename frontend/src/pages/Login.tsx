import { useContext, useState } from "react";
import { getLoggedInUser, loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { UserContext} from "../context/UserContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }
    

    //localStorage.removeItem("token");
    

    let handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            const loginResponse = await loginUser(email, password);
            console.log("login result", loginResponse);

            if (loginResponse && loginResponse.token) {
                localStorage.setItem("token", loginResponse.token);
            } else {
                setError("Wrong email or password");
            }

            const token = localStorage.getItem("token");

            if (token) {
                const fetchedUser = await getLoggedInUser(token || "");
                console.log("fetched user", fetchedUser);

                if (fetchedUser.user) {
                    setUser(fetchedUser.user);

                    navigate("/start-page");
                } else {
                    setError("No user found in responseee");
                }
            } else {
                setError("No users found in response");
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