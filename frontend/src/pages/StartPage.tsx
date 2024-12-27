import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { useUser } from "../context/UserContext";

export const StartPage = () => {
    const { user, loading} = useUser();
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            
            <header>
                <LogoutButton />
                <p className="user-info">{user?.firstName} {user?.country}</p>
            </header>
            
            <section>
                <h1>Start Page</h1>
                <p>Welcome {user?.firstName} to the start page</p>
                <button onClick={() => handleNavigation('/start-game-page')} type="submit">Start Playing</button>
                <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
            </section>
        </>
    );
};

export default StartPage;