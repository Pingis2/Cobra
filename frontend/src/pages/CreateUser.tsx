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
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            // Pass the user data to the createUser function
            const data = await createUser(userName, firstName, lastName, email, password, country);
            console.log("create user result", data);

            if (data) {
                // Once the user is created, you can navigate and store user info
                navigate("/start-page");
                localStorage.setItem("user", JSON.stringify(data));
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
                <label htmlFor="firstName">First name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <label htmlFor="lastName">Last name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                {error && <p>{error}</p>}
                <button type="submit">Create User</button>
            </form>

                <p onClick={() => handleNavigation('/login')}>Already have an account? Click here to log in</p>
            </section>
        </>
    );
}

export default CreateUser;