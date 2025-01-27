import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";
import { FlyingBirds } from "../components/FlyingBirds";
import { useTranslation } from "react-i18next";

export const StartPage = () => {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

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

            <section className="start-container">
                <h1>{t("start.title")}</h1>
                <div className="user-buttons">
                    <p>{t("start.welcome", { username: user?.userName} )}</p>
                    <nav className="nav-buttons">
                        <button onClick={() => handleNavigation('/start-game')} type="submit">{t("start.start-playing")}</button>
                        <button onClick={() => handleNavigation('/leaderboard')} type="submit">{t("start.leaderboard")}</button>
                    </nav>
                </div>
                <FlyingBirds />
            </section>
        </>
    );
};

export default StartPage;