import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import LogoutButton from "../components/Logout";

const gridSize = 30;
const cellSize = 30;

export const Game = () => {
    const { user } = useContext(UserContext);
    const [snake, setSnake] = useState([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
    ]);
    const [food, setFood] = useState({ 
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    });
    
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            let newDirection = direction;

            if (key === "ArrowUp" || key === "w") {
                newDirection = { x: 0, y: -1 };
            } else if (key === "ArrowDown" || key === "s") {
                newDirection = { x: 0, y: 1 };
            } else if (key === "ArrowLeft" || key === "a") {
                newDirection = { x: -1, y: 0 };
            } else if (key === "ArrowRight" || key === "d") {
                newDirection = { x: 1, y: 0 };
            }

            if (
                newDirection.x !== -direction.x ||
                newDirection.y !== -direction.y
            ) {
                setDirection(newDirection);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);;

    useEffect(() => {
        let animationFrameId: number;
        let lastUpdateTime = performance.now();
        const gameSpeed = 100; // Speed in millisecondss

        const gameLoop = (currentTime: number) => {
            const deltaTime = currentTime - lastUpdateTime;

            if (deltaTime >= gameSpeed) {
                setSnake((prevSnake) => {
                    const newHead = {
                        x: (prevSnake[0].x + direction.x + gridSize) % gridSize,
                        y: (prevSnake[0].y + direction.y + gridSize) % gridSize,
                    };

                    if (prevSnake.some(
                        (segment) =>
                            segment.x === newHead.x &&
                            segment.y === newHead.y)
                    ) {
                        setGameOver(true);
                        setGameStarted(false);
                        return prevSnake;
                    }

                    const newSnake = [newHead, ...prevSnake];
                    if (newHead.x === food.x && newHead.y === food.y) {
                        setFood({
                            x: Math.floor(Math.random() * gridSize),
                            y: Math.floor(Math.random() * gridSize),
                        });
                    } else {
                        newSnake.pop();
                    }

                    return newSnake;
                });

                lastUpdateTime = currentTime;
            }

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        if (gameStarted && !gameOver) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [direction, gameOver, food, gameStarted]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        ctx.fillStyle = "green";
        snake.forEach((segment) => {
            ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
        });

        // Draw the food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    }, [snake, food]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
        ]);
        setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        })
        setDirection({ x: 1, y: 0 });
    }

    return (
        <>
            <div>
                <header>
                    <LogoutButton />
                    <p className="user-info">{user?.firstName} {user?.country}</p>
                </header>
                
                <canvas
                    ref={canvasRef}
                    width={gridSize * cellSize}
                    height={gridSize * cellSize}
                    style={{
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                    }}
                ></canvas>
                {!gameStarted && (
                    <div>
                        <button onClick={startGame} type="button">Start Game</button>
                    </div>
                )}
                {gameOver && (
                    <div>
                        <h2>Game Over!</h2>
                        <button onClick={startGame} type="button">Restart</button>
                    </div>
                )}
            </div>
        </>
    )
}