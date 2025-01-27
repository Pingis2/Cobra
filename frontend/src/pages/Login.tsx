import { useContext, useEffect, useState } from "react";
import { getLoggedInUser, loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { UserContext} from "../context/UserContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { useTranslation } from "react-i18next";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                        <LanguageToggle />       
                        <h2>{t("login.title")}</h2>
                        <section className="login-container">
                            <form className="login-form" onSubmit={handleLogin}>
                                <label className="form-label">
                                    <p>{t("login.email")}:</p>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        id="email"    
                                    />
                                </label>
                                <label className="form-label">
                                    <p>{t("login.password")}:</p>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        id="password"    
                                    />
                                </label>
                                {error && <p>{error}</p>}

                                    <button type="submit" className="login-button">{t("login.login-button")}</button>
                            </form>
                        

                            <p onClick={() => handleNavigation('/create-account')} className="create-account">{t("login.create-account-link")}</p>
                        </section>
                    </>
                )}
            </section>
        </>
    );
}

export default Login;