import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";

export const StartPage = () => {
    const { user, loading } = useContext(UserContext);
    console.log("user", user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const countryImage = () => {
        if (user?.country === "England") {
            return <img src={EnglandFlag} alt="England flag" className="user-country" />;
        } else if (user?.country === "Sweden") {
            return <img src={SwedenFlag} alt="Sweden flag" className="user-country" />;
        } else if (user?.country === "USA") {
            return <img src={AmericanFlag} alt="USA flag" className="user-country" />;
        }
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.firstName} {countryImage()}</p>
                    <LogoutButton />
                </div>
            </header>
            
            <section>
                <h1>Start Page</h1>
                <div className="user-buttons">
                    <p>Welcome {user?.firstName} to the start page</p>
                    <nav className="nav-buttons">
                        <button onClick={() => handleNavigation('/start-game-page')} type="submit">Start Playing</button>
                        <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
                    </nav>
                </div>
            </section>
        </>
    );
};

export default StartPage;