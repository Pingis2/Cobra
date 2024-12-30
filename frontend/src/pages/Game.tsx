import { useEffect, useRef, useState } from "react";

const gridSize = 20;
const cellSize = 20;

export const Game = () => {
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
    const [nextDirection, ] = useState(direction);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "ArrowUp" || key === "w") {
                setDirection({ x: 0, y: -1 });
            } else if (key === "ArrowDown" || key === "s") {
                setDirection({ x: 0, y: 1 });
            } else if (key === "ArrowLeft" || key === "a") {
                setDirection({ x: -1, y: 0 });
            } else if (key === "ArrowRight" || key === "d") {
                setDirection({ x: 1, y: 0 });
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    useEffect(() => {
        setDirection(nextDirection);
    }, [nextDirection]);

    useEffect(() => {
        let animationFrameId: number;
        let lastUpdateTime = performance.now();
        const gameSpeed = 100; // Speed in milliseconds

        const gameLoop = (currentTime: number) => {
            const deltaTime = currentTime - lastUpdateTime;

            if (deltaTime >= gameSpeed) {
                setSnake((prevSnake) => {
                    const newHead = {
                        x: (prevSnake[0].x + direction.x + gridSize) % gridSize,
                        y: (prevSnake[0].y + direction.y + gridSize) % gridSize,
                    };

                    if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                        setGameOver(true);
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

        if (!gameOver) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [direction, gameOver, food]);

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

    const restartGame = () => {
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
        setGameOver(false);
    }

    return (
        <>
            <div>
                <h1>Game</h1>
                
                <canvas
                    ref={canvasRef}
                    width={gridSize * cellSize}
                    height={gridSize * cellSize}
                    style={{
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                    }}
                ></canvas>
                {gameOver && (
                    <div>
                        <h2>Game Over!</h2>
                        <button onClick={restartGame}>Restart</button>
                    </div>
                )}
            </div>
        </>
    )
}