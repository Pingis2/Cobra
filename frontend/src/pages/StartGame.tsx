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


export const StartGamePage = () => {
    const { user } = useContext(UserContext);
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
                <h1>Cobra</h1>
                <div className="instructions">
                    <section className="movement-instructions">
                        <h2>Movement</h2>
                        <div className="keys-instructions">
                            <ul className="keys-container">
                                <li className="text-container">
                                    <p className="instructions-1">Use the arrow keys or "W, A, S, D" to move the snake</p>
                                </li>
                                <li className="keys-container">
                                    <img src={ArrowKeysWhiteImage} alt="Arrow keys" className="keys-image" />
                                    <img src={WASDKeysWhiteImage} alt="WASD keys" className="keys-image" />
                                </li>
                            </ul>
                        </div>
                        <div className="phone-instructions">
                            <p>If on mobile you can swipe the screen or use the buttons below</p>
                            <div className="phone-images">
                                <img src={PhoneSwipeImage} alt="Swipe the screen" className="phone-swipe-image" />
                                <img src={PhoneButtonsImage} alt="Phone buttons" className="phone-buttons-image" />
                            </div>
                        </div>
                    </section>
                    <span className="seperation-line"></span>
                    <section className="points-instructions">
                        <h2>Point system and rules</h2>
                        <p>Normal snake rules apply</p>
                        <ul>
                            <li className="apple-container">
                                <img src={AppleImage} alt="Red apple" className="apple-image" width={63} height={71}/>
                                <p>The red apple is normal and gives you 100 points</p>
                            </li>
                            <li className="apple-container">
                                <img src={SlowAppleImage} alt="Yellow apple" className="apple-image" width={63} height={71} />
                                <p>The yellow apple makes you go slower for 5 seconds and it gives you 80 points</p>
                            </li>
                            <li className="apple-container">
                                <img src={FastAppleImage} alt="Blue apple" className="apple-image" width={63} height={71} />
                                <p>The blue apple makes you go faster for 5 seconds and it gives you 150 points</p>
                            </li>
                        </ul>
                        <p className="score-saved">Your score will be saved after the game is over</p>
                    </section>
                </div>
                <p className="click-to-start">Click the button below to start the game.</p>
                <button type="button" onClick={() => handleNavigation("/game")}>Start Game</button>
            </div>
        </>
    );
}