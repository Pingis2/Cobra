import { useContext, useEffect, useState } from "react";
import { getLoggedInUser, loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { UserContext} from "../context/UserContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
    }, []);
    

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const retryLogin = async (email: string, password: string, retries: number = 15, delay: number = 2000) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await loginUser(email, password);
                return response; // Successful login
            } catch (error) {
                if (attempt < retries - 1) {
                    console.error(`Retrying login (${attempt + 1}/${retries})...`);
                    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
                } else {
                    throw error; // Throw error after max retries
                }
            }
        }
    };
    

    let handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const loginResponse = await retryLogin(email, password);
            console.log("login result", loginResponse);

            if (loginResponse && loginResponse.token) {
                sessionStorage.setItem("token", loginResponse.token);
            } else {
                setError("Wrong email or password");
            }

            const token = sessionStorage.getItem("token");

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
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="login-page">
                {loading ? (
                    <p className="loading-text">Logging in, please wait <span className="dots"></span>
                    </p>
                ) : (
                    <>
                        <h2>Log in to your account</h2>
                        <section className="login-container">
                            <form className="login-form" onSubmit={handleLogin}>
                                <label className="form-label">
                                    <p>Email:</p>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        id="email"    
                                    />
                                </label>
                                <label className="form-label">
                                    <p>Password:</p>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        id="password"    
                                    />
                                </label>
                                {error && <p>{error}</p>}

                                <button type="submit" className="login-button">Login</button>
                            </form>
                        

                            <p onClick={() => handleNavigation('/create-account')} className="create-account">Don't have an account? Click to create one</p>
                        </section>
                    </>
                )}
            </section>
        </>
    );
}

export default Login;