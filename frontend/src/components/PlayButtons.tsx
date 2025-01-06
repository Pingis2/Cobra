import { useEffect, useRef } from "react"


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
                    🔼
                </button>
                <button
                    type="button"
                    className="play-button-down"
                    title="Move down"
                    onClick={() => handleButtonPress({ x: 0, y: 1 })}
                >
                    🔽
                </button>
                <button
                    type="button"
                    className="play-button-left"
                    title="Move left"
                    onClick={() => handleButtonPress({ x: -1, y: 0 })}
                >
                    ◀️
                </button>
                <button
                    type="button"
                    className="play-button-right"
                    title="Move right"
                    onClick={() => handleButtonPress({ x: 1, y: 0 })}
                >
                    ▶️
                </button>
            </div>
        </>
    )
}
