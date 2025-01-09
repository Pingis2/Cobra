import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { CountryFlag } from "../components/CountryFlag";
import Jungle1 from "../assets/images/jungle/jungle-1.png";
import Jungle2 from '../assets/images/jungle/jungle-2.png';
import Jungle3 from '../assets/images/jungle/jungle-3.png';
import Jungle4 from '../assets/images/jungle/jungle-4.png';

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
                <img src={Jungle1} alt="Jungle" className="jungle-1" />
                <img src={Jungle2} alt="Jungle" className="jungle-2" />
                <img src={Jungle3} alt="Jungle" className="jungle-3" />
                <img src={Jungle4} alt="Jungle" className="jungle-4" />
            </header>
            
            <section>
                <h1>Start Page</h1>
                <div className="user-buttons">
                    <p>Welcome {user?.userName} to the start page</p>
                    <nav className="nav-buttons">
                        <button onClick={() => handleNavigation('/start-game')} type="submit">Start Playing</button>
                        <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default StartPage;