import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import LogoutButton from "../components/Logout";

const gameSpeed = 50;
const renderFps = 1000;
const cellSize = 20;

export const Game = () => {
    const { user } = useContext(UserContext);
    const [canvasWidth, setCanvasWidth] = useState(40);
    const [canvasHeight, setCanvasHeight] = useState(40);
    const [snake, setSnake] = useState([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
    ]);
    const [food, setFood] = useState({ 
        x: Math.floor(Math.random() * canvasWidth),
        y: Math.floor(Math.random() * canvasHeight)
    });
    
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const genereateFood = () => {
        let newFood = {
            x: Math.floor(Math.random() * canvasWidth),
            y: Math.floor(Math.random() * canvasHeight)
        };
        while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            newFood = {
                x: Math.floor(Math.random() * canvasWidth),
                y: Math.floor(Math.random() * canvasHeight)
            };
        }
        return newFood;
    }

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

            if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
                setDirection(newDirection);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);;

    useEffect(() => {
        let animationFrameId: number;
        let lastUpdateTime = performance.now();
        let lastMoveTime = performance.now();
        const moveInterval = gameSpeed;

        const gameLoop = (currentTime: number) => {
            const deltaTime = currentTime - lastUpdateTime;

            if (deltaTime >= 1000 / renderFps) {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext("2d");

                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw the snake
                    ctx.fillStyle = "green";
                    snake.forEach((segment) => {
                        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
                    });

                    // Draw the food
                    ctx.fillStyle = "red";
                    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
                }
                lastUpdateTime = currentTime;
            }

            if (currentTime - lastMoveTime >= moveInterval) {
                setSnake((prevSnake) => {
                    const newHead = {
                        x: prevSnake[0].x + direction.x,
                        y: prevSnake[0].y + direction.y,
                    };

                    if (
                        newHead.x < 0 || newHead.x >= canvasWidth ||
                        newHead.y < 0 || newHead.y >= canvasHeight ||
                        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
                    ) {
                        if (!gameOver) {
                            setGameOver(true);
                            setGameStarted(false);
                        }
                        return prevSnake;
                    }

                    const newSnake = [newHead, ...prevSnake];
                    if (newHead.x === food.x && newHead.y === food.y) {
                        setFood(genereateFood());
                    } else {
                        newSnake.pop();
                    }

                    lastMoveTime = currentTime;
                    return newSnake;
                });
            }

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        if (gameStarted && !gameOver) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [direction, gameOver, food, gameStarted, snake]);

    useEffect(() => {

        let startX = 0;
        let startY = 0;

        const handleTouchStart = (event: TouchEvent) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            const touch = event.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0 && direction.x !== -1) {
                    setDirection({ x: 1, y: 0 }); // Right
                } else if (deltaX < 0 && direction.x !== 1) {
                    setDirection({ x: -1, y: 0 }); // Left
                }
            } else {
                if (deltaY > 0 && direction.y !== -1) {
                    setDirection({ x: 0, y: 1 }); // Down
                } else if (deltaY < 0 && direction.y !== 1) {
                    setDirection({ x: 0, y: -1 }); // Up
                }
            }
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCanvasHeight(20);
                setCanvasWidth(20);
            } else {
                setCanvasHeight(40);
                setCanvasWidth(40);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
        ]);
        setFood(genereateFood());
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
                    width={canvasWidth * cellSize}
                    height={canvasHeight * cellSize}
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