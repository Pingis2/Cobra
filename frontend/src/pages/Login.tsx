import { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    

    let handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await loginUser(email, password);
            console.log(data);
            if (data) {
                navigate("/");
            } else {
                setError("Wrong email or password");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Error during login");
        }
    }

    return (
        <section>
            <h1>Login</h1>
            <p>Log in to your account</p>
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
                <button type="submit">Login</button>
            </form>
        </section>
    );
}