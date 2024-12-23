import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    const button = () => {
        navigate("/login");
    }

    return (
        <>
            Home
            <button onClick={button}>Login</button>
        </>
    );
}

export default Home;