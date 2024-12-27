import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    localStorage.removeItem("token");

    return (
        <>
            Home
            <button onClick={() => handleNavigation('/login')} type="submit">Login</button>
        </>
    );
}

export default Home;