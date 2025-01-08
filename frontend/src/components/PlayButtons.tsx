import { useEffect, useRef } from "react";


interface PlayButtonsProps {
    direction: { x: number, y: number };
    setDirection: (newDirection: { x: number, y: number }) => void;
    gameStarted: boolean;
    gameOver: boolean;
}

export const PlayButtons = ({ direction, setDirection, gameStarted, gameOver }: PlayButtonsProps) => {
    const directionRef = useRef(direction);

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    const handleButtonPress = (newDirection: { x: number, y: number }) => {
        if (gameStarted && !gameOver) {

            if (
                (directionRef.current.x === 1 && newDirection.x === -1) ||
                (directionRef.current.x === -1 && newDirection.x === 1) ||
                (directionRef.current.y === 1 && newDirection.y === -1) ||
                (directionRef.current.y === -1 && newDirection.y === 1)
            ) {
                return;
            }
            setDirection(newDirection);
        }
    }

    return (
        <>
            <div className="play-buttons">
                <button
                    type="button"
                    className="play-button-up"
                    title="Move up"
                    onClick={() => handleButtonPress({ x: 0, y: -1 })}
                >
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                <button
                    type="button"
                    className="play-button-down"
                    title="Move down"
                    onClick={() => handleButtonPress({ x: 0, y: 1 })}
                >
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                <button
                    type="button"
                    className="play-button-left"
                    title="Move left"
                    onClick={() => handleButtonPress({ x: -1, y: 0 })}
                >
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                <button
                    type="button"
                    className="play-button-right"
                    title="Move right"
                    onClick={() => handleButtonPress({ x: 1, y: 0 })}
                >
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
            </div>
        </>
    )
}
