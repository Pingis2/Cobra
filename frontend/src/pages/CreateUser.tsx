import { useNavigate } from "react-router-dom";


export const CreateUser = () => {

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <>
            <h1>Create Account</h1>
            <form className="create-user-form">
                <label htmlFor="firstName">First name:</label>
                <input type="text" id="firstName" name="firstName" required />

                <label htmlFor="lastName">Last name:</label>
                <input type="text" id="lastName" name="lastName" required />

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <label htmlFor="country">Country:</label>
                <input type="text" id="country" name="country" required />

                <button type="submit">Create User</button>
            </form>

            <p onClick={() => handleNavigation('/login')}>Already have an account? Click here to log in</p>
        </>
    );
}

export default CreateUser;