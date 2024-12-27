import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";


export const CreateUser = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const [highscore] = useState(0);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            const data = await createUser(userName, firstName, lastName, email, password, country, highscore);
            console.log("create user result", data);

            if (data) {
                navigate("/login");
            } else {
                setError("Failed to create user");
            }
        } catch (error: any) {
            console.error("Error during user creation:", error);
            if (error.response) {
                // Handle specific HTTP errors
                if (error.response.status === 409) {
                    setError("User already exists");
                } else {
                    setError("An error occurred during user creation");
                }
            } else {
                setError("Network or server error");
            }
        }
        
    }

    return (
        <>
            <h1>Create Account</h1>
            <section className="create-user-container">
                <form className="create-user-form" onSubmit={handleCreateUser}>
                    <div className="input-container">
                        <label htmlFor="firstName">First name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="lastName">Last name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="user-name"    
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            className="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </div>
                {error && <p>{error}</p>}
                <button type="submit">Create User</button>
            </form>

                <p onClick={() => handleNavigation('/login')}>Already have an account? Click here to log in</p>
            </section>
        </>
    );
}

export default CreateUser;