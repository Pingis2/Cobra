import { useContext } from "react";
import LogoutButton from "../components/Logout";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";
//import WASDKeysImage from '../assets/images/keys/wasd-keys.png';
//import ArrowKeysImage from '../assets/images/keys/arrow-keys.png';
import WASDKeysWhiteImage from '../assets/images/keys/wasd-keys-white.png';
import ArrowKeysWhiteImage from '../assets/images/keys/arrow-keys-white.png';
import AppleImage from '../assets/images/apples/red-apple.webp';
import SlowAppleImage from '../assets/images/apples/yellow-apple.webp';
import FastAppleImage from '../assets/images/apples/blue-apple.webp';
import PhoneSwipeImage from '../assets/images/phone/phone-swipe.png';
import PhoneButtonsImage from '../assets/images/phone/phone-buttons.png';
import { useTranslation } from "react-i18next";


export const StartGamePage = () => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <header className="header-with-back-button">
                <div className="back-button">
                    <BackButton />
                </div>
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                    <LogoutButton />
                </div>
                <Jungle />
            </header>

            <div className="instructions-container">
                <h1>{t("start-game.title")}</h1>
                <div className="instructions">
                    <section className="movement-instructions">
                        <h2>{t("start-game.movement")}</h2>
                        <div className="keys-instructions">
                            <ul className="keys-container">
                                <li className="text-container">
                                    <p className="instructions-1">{t("start-game.movement-description-keys")}</p>
                                </li>
                                <li className="keys-container">
                                    <img src={ArrowKeysWhiteImage} alt="Arrow keys" className="keys-image" />
                                    <img src={WASDKeysWhiteImage} alt="WASD keys" className="keys-image" />
                                </li>
                            </ul>
                        </div>
                        <div className="phone-instructions">
                            <p>{t("start-game.movement-description-mobile")}</p>
                            <div className="phone-images">
                                <img src={PhoneSwipeImage} alt="Swipe the screen" className="phone-swipe-image" />
                                <img src={PhoneButtonsImage} alt="Phone buttons" className="phone-buttons-image" />
                            </div>
                        </div>
                    </section>
                    <span className="seperation-line"></span>
                    <section className="points-instructions">
                        <h2>{t("start-game.points-rules")}</h2>
                        <p>{t("start-game.rules-description")}</p>
                        <ul>
                            <li className="apple-container">
                                <img src={AppleImage} alt="Red apple" className="apple-image" width={63} height={71}/>
                                <p>{t("start-game.points-description-red")}</p>
                            </li>
                            <li className="apple-container">
                                <img src={SlowAppleImage} alt="Yellow apple" className="apple-image" width={63} height={71} />
                                <p>{t("start-game.points-description-yellow")}</p>
                            </li>
                            <li className="apple-container">
                                <img src={FastAppleImage} alt="Blue apple" className="apple-image" width={63} height={71} />
                                <p>{t("start-game.points-description-blue")}</p>
                            </li>
                        </ul>
                        <p className="score-saved">{t("start-game.points-saved")}</p>
                    </section>
                </div>
                <p className="click-to-start">{t("start-game.start-game-text")}</p>
                <button type="button" onClick={() => handleNavigation("/game")}>{t("start-game.start-game-button")}</button>
            </div>
        </>
    );
}