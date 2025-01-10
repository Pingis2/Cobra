import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";
import { FlyingBirds } from "../components/FlyingBirds";
export const StartPage = () => {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                    <LogoutButton />
                </div>
                <Jungle />
            </header>
            
            <section>
                <h1>Start</h1>
                <div className="user-buttons">
                    <p>Welcome {user?.userName} to the start page</p>
                    <nav className="nav-buttons">
                        <button onClick={() => handleNavigation('/start-game')} type="submit">Start Playing</button>
                        <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
                    </nav>
                </div>
                <FlyingBirds />
            </section>
        </>
    );
};

export default StartPage;