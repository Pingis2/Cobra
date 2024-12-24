import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <>
            Home
            <button onClick={() => handleNavigation('/login')} type="submit">Login</button>
        </>
    );
}

export default Home;