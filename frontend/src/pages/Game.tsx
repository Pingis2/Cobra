import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { updateUserScore } from "../services/userService";
import { PlayButtons } from "../components/PlayButtons";
import { CountryFlag } from "../components/CountryFlag";

const renderFps = 2000;
const cellSize = 15;

export const Game = () => {
    const { user, setUser } = useUser();
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
    const [currentScore, setCurrentScore] = useState(0);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const directionRef = useRef(direction);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [timer, setTimer] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameSpeed, setGameSpeed] = useState(50);
    const [slowApple, setSlowApple] = useState({ x: -1, y: -1 });
    const [fastApple, setFastApple] = useState({ x: -1, y: -1 });
    const [slowAppleTimer, setSlowAppleTimer] = useState<NodeJS.Timeout | null>(null);
    const [fastAppleTimer, setFastAppleTimer] = useState<NodeJS.Timeout | null>(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Generate food --------------------------------------------------------------
    const generateFood = () => {
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
    };

    // Power ups --------------------------------------------------------------

    // Generate slow apple --------------------------------------------------------------
    const generateSlowApple = () => {
        const newSlowApple = generateFood();
        setSlowApple(newSlowApple)
        if (slowAppleTimer) {
            clearTimeout(slowAppleTimer);
        }
        const timer = setTimeout(() => {
            setSlowApple({ x: -1, y: -1 });
        }, 15000);
        setSlowAppleTimer(timer);
    };

    // Generete fast apple --------------------------------------------------------------
    const generateFastApple = () => {
        const newFastApple = generateFood();
        setFastApple(newFastApple)
        if (fastAppleTimer) {
            clearTimeout(fastAppleTimer);
        }
        const timer = setTimeout(() => {
            setFastApple({ x: -1, y: -1 });
        }, 15000);
        setFastAppleTimer(timer);
    }

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    // Handle user input (keyboard + touch)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            let newDirection = directionRef.current;

            if (key === "ArrowUp" || key === "w" || key === "W") {
                newDirection = { x: 0, y: -1 };
            } else if (key === "ArrowDown" || key === "s" || key === "S") {
                newDirection = { x: 0, y: 1 };
            } else if (key === "ArrowLeft" || key === "a" || key === "A") {
                newDirection = { x: -1, y: 0 };
            } else if (key === "ArrowRight" || key === "d" || key === "D") {
                newDirection = { x: 1, y: 0 };
            }

            if (newDirection.x !== -directionRef.current.x || newDirection.y !== -directionRef.current.y) {
                directionRef.current = newDirection;
                setDirection(newDirection);
            }
        };

        let startX = 0;
        let startY = 0;
        let lastTouchMoveTime = 0;

        const handleTouchStart = (event: TouchEvent) => {
            if ((event.target as HTMLElement).closest('.play-buttons')) {
                return;
            }
            
            if (gameStarted && !gameOver) {
                event.preventDefault();
            }
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if ((event.target as HTMLElement).closest('.play-buttons')) {
                return;
            }

            if (gameStarted && !gameOver) {
                event.preventDefault();
            }
            const currentTime = performance.now();
            if (currentTime - lastTouchMoveTime < 100) return;

            lastTouchMoveTime = currentTime;
            const touch = event.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0 && directionRef.current.x !== -1) {
                    setDirection({ x: 1, y: 0 }); // Right
                } else if (deltaX < 0 && directionRef.current.x !== 1) {
                    setDirection({ x: -1, y: 0 }); // Left
                }
            } else {
                if (deltaY > 0 && directionRef.current.y !== -1) {
                    setDirection({ x: 0, y: 1 }); // Down
                } else if (deltaY < 0 && directionRef.current.y !== 1) {
                    setDirection({ x: 0, y: -1 }); // Up
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [gameStarted, gameOver]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCanvasHeight(25);
                setCanvasWidth(25);
            } else {
                setCanvasHeight(40);
                setCanvasWidth(40);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        let animationFrameId: number;
        let lastUpdateTime = performance.now();
        let lastMoveTime = performance.now();
        const normalFoodPoints = 100;
        const slowApplePoints = 80;
        const fastApplePoints = 150;


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

                    // Draw slow apple
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(slowApple.x * cellSize, slowApple.y * cellSize, cellSize, cellSize);

                    // Draw fast apple
                    ctx.fillStyle = "blue";
                    ctx.fillRect(fastApple.x * cellSize, fastApple.y * cellSize, cellSize, cellSize);
                }
                lastUpdateTime = currentTime;
            }

            if (currentTime - lastMoveTime >= gameSpeed) {
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
                        setCurrentScore(currentScore + normalFoodPoints);
                        setFood(generateFood());
                    } else if (newHead.x === slowApple.x && newHead.y === slowApple.y) {
                        setCurrentScore(currentScore + slowApplePoints);
                        setGameSpeed(100);
                        setTimeout(() => setGameSpeed(50), 5000);
                        setSlowApple({ x: -1, y: -1 });
                    } else if (newHead.x === fastApple.x && newHead.y === fastApple.y) {
                        setCurrentScore(currentScore + fastApplePoints);
                        setGameSpeed(25);
                        setTimeout(() => setGameSpeed(50), 5000);
                        setFastApple({ x: -1, y: -1 });
                    }
                    else {
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

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStarted, gameOver, snake, food, direction, currentScore]);

    useEffect(() => {
        const powerUpInterval = setInterval(() => {
            generateSlowApple();
            generateFastApple();
        }, 30000);

        return () => {
            clearInterval(powerUpInterval);
        };
    }, [])

    useEffect(() => {
        const updateScore = async () => {
            if (gameOver) {
                // Prevent multiple updates by checking if the latest score is already set
                if (user && currentScore !== user.latestScore) {
                    // Update user context only if the score has changed
                    if (token && currentScore > user.highscore) {
                        await updateUserScore(token, currentScore);
                        setUser({
                            ...user,
                            latestScore: currentScore,
                            highscore: currentScore,
                            timer: timer
                        });
                    } else {
                        setUser({
                            ...user,
                            latestScore: currentScore,
                            timer: timer 
                        });
                    }
                }

                // Navigate to the results page only once
                if (!user?.latestScore || user.latestScore !== currentScore) {
                    navigate("/results");
                }
            }
        }
        updateScore();
        
    }, [gameOver, currentScore, user?.latestScore, user?.highscore, setUser, navigate, timer]);


    //Timer and countdown --------------------------------------------------------------
    const startCountdown = () => {
        setCountdown(3); // Start countdown at 3 seconds
        const intervalId = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(intervalId);
                    startGame(); // Start game after countdown
                }
                return prev - 1;
            });
        }, 1000);
    };
    
    const startTimer = () => {
        setTimer(0);
        const intervaldId = setInterval(() => {
            setTimer((prev) => {
                if (prev === 0) {
                    clearInterval(intervaldId);
                }
                return prev + 1;
            });
        }, 1000);
    }

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    // Start game --------------------------------------------------------------
    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setCurrentScore(0);
        startTimer();
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
        ]);
        setFood(generateFood());
        setDirection({ x: 1, y: 0 });
        
    }

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                </div>
            </header>
            <div className="stats-container">
                <p className="current-score">Current score: {currentScore}</p>
                <p className="timer">Time: {formatTime(timer)}</p>
                <p className="higscore">Highscore: {user?.highscore}</p>
            </div>
            <section className="game-container">
                <canvas
                    ref={canvasRef}
                    width={canvasWidth * cellSize}
                    height={canvasHeight * cellSize}
                    style={{
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                    }}
                >
                </canvas>
                {!gameStarted && countdown === 0 && (
                    <button onClick={startCountdown} type="button" className="start-game-button">Start Game</button>
                )}
                {!gameStarted && countdown > 0 && (
                    <div className="countdown">{countdown}</div>
                )}
            </section>
            
            {window.innerWidth < 768 && (
                <PlayButtons
                    direction={direction}
                    setDirection={setDirection}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                />
            )}
            
        </>
    )
}