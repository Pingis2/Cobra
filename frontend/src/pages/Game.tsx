import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { updateUserScore } from "../services/userService";
import { PlayButtons } from "../components/PlayButtons";
import { CountryFlag } from "../components/CountryFlag";
import { Jungle } from "../components/Jungle";
import EatingSound from '../assets/sounds/eating-sound.wav';
import { MovementSounds } from "../components/MovementSounds";
import AppleImage from '../assets/images/apples/red-apple.webp';
import SlowAppleImage from '../assets/images/apples/yellow-apple.webp';
import FastAppleImage from '../assets/images/apples/blue-apple.webp';
import SoundOnImage from '../assets/images/sound-icons/icon-1628258_640.png';
import SoundOffImage from '../assets/images/sound-icons/mute-1628277_640.png';
import CobraHead from '../assets/images/cobra/cobra-head.webp';
import CobraNeck from '../assets/images/cobra/cobra-neck.webp';
import CobraBody from '../assets/images/cobra/cobra-body.webp';
import CobraTail from '../assets/images/cobra/cobra-tail.webp';
import { useTranslation } from "react-i18next";

const renderFps = 2000;
const cellSize = 15;

export const Game = () => {
    const { user, setUser } = useUser();
    const [canvasWidth, setCanvasWidth] = useState(40);
    const [canvasHeight, setCanvasHeight] = useState(40);
    const { t } = useTranslation();
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
    const [contextUpdated, setContextUpdated] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [timer, setTimer] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameSpeed, setGameSpeed] = useState(50);
    const [slowApple, setSlowApple] = useState({ x: -1, y: -1 });
    const [fastApple, setFastApple] = useState({ x: -1, y: -1 });
    const [slowAppleTimer, setSlowAppleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [fastAppleTimer, setFastAppleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [soundOn, setSoundOn] = useState(true);
    const soundOnRef = useRef(soundOn);
    const [, setAppleIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
    const cobraHeadImg = useRef(new Image());
    const cobraNeckImg = useRef(new Image());
    const cobraBodyImg = useRef(new Image());
    const cobraTailImg = useRef(new Image());
    cobraHeadImg.current.src = CobraHead;
    cobraNeckImg.current.src = CobraNeck;
    cobraBodyImg.current.src = CobraBody;
    cobraTailImg.current.src = CobraTail;

    const appleImg = useRef(new Image());
    appleImg.current.src = AppleImage;

    const slowAppleImg = useRef(new Image());
    slowAppleImg.current.src = SlowAppleImage;

    const fastAppleImg = useRef(new Image());
    fastAppleImg.current.src = FastAppleImage;

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const toggleSound = () => {
        setSoundOn((prevSoundOn) => {
            soundOnRef.current = !prevSoundOn;
            
            return !prevSoundOn;
        })
    };

    const playMovementSound = (direction: { x: number, y: number }) => {
        if (!soundOnRef.current) return;
        
        if (direction.x === 1) {
            MovementSounds().movementRight();
        } else if (direction.x === -1) {
            MovementSounds().movementLeft();
        } else if (direction.y === 1) {
            MovementSounds().movementDown();
        } else if (direction.y === -1) {
            MovementSounds().movementUp();
        }
    }

    const playEatingSound = () => {
        if (soundOn) {
            const sound = new Audio(EatingSound);
            sound.play();
        }
    };

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

    useEffect(() => {
        soundOnRef.current = soundOn;
    }, [soundOn]);

    // Handle user input (keyboard + touch) --------------------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            let newDirection = directionRef.current;

            if (key === "ArrowUp" || key === "w" || key === "W" && directionRef.current.y !== 1) {
                newDirection = { x: 0, y: -1 };
                //MovementSounds().movementUp();
            } else if (key === "ArrowDown" || key === "s" || key === "S" && directionRef.current.y !== -1) {
                newDirection = { x: 0, y: 1 };
                //MovementSounds().movementDown();
            } else if (key === "ArrowLeft" || key === "a" || key === "A" && directionRef.current.x !== 1) {
                newDirection = { x: -1, y: 0 };
                //MovementSounds().movementLeft();
            } else if (key === "ArrowRight" || key === "d" || key === "D" && directionRef.current.x !== -1) {
                newDirection = { x: 1, y: 0 };
                //MovementSounds().movementRight();
            }

            if (
                newDirection.x !== -directionRef.current.x ||
                newDirection.y !== -directionRef.current.y
            ) {
                directionRef.current = newDirection;
                setDirection(newDirection);
                playMovementSound(newDirection);
            }
        };

        let startX = 0;
        let startY = 0;
        let lastTouchMoveTime = 0;

        const handleTouchStart = (event: TouchEvent) => {
            if ((event.target as HTMLElement).closest('.play-buttons') || (event.target as HTMLElement).closest('.sound-icon')) {
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
            if ((event.target as HTMLElement).closest('.play-buttons') || (event.target as HTMLElement).closest('.sound-icon')) {
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

            let newDirection = directionRef.current;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0 && directionRef.current.x !== -1) {
                    newDirection = { x: 1, y: 0 }; // Right
                } else if (deltaX < 0 && directionRef.current.x !== 1) {
                    newDirection = { x: -1, y: 0 }; // Left
                }
            } else {
                if (deltaY > 0 && directionRef.current.y !== -1) {
                    newDirection = { x: 0, y: 1 }; // Down
                } else if (deltaY < 0 && directionRef.current.y !== 1) {
                    newDirection = { x: 0, y: -1 }; // Up
                }
            }

            if (
                newDirection.x !== directionRef.current.x ||
                newDirection.y !== directionRef.current.y
            ) {
                directionRef.current = newDirection;
                setDirection(newDirection);
                playMovementSound(newDirection);
                // Play the appropriate movement sound
                
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
                    snake.forEach((segment, index) => {
                        ctx.save();

                        ctx.translate(segment.x * cellSize + cellSize / 2, segment.y * cellSize + cellSize / 2);
                        if (index === 0) {
                            const headScale = 2.5;
                            const scaledCellSize = cellSize * headScale;

                            const headDirection = {
                                x: segment.x - snake[index + 1].x,
                                y: segment.y - snake[index + 1].y
                            }

                            if (headDirection.x === 1) {
                                ctx.rotate(Math.PI / 2);
                            } else if (headDirection.x === -1) {
                                ctx.rotate(-Math.PI / 2);
                            } else if (headDirection.y === 1) {
                                ctx.rotate(Math.PI);
                            } else if (headDirection.y === -1) {
                                ctx.rotate(0);
                            }

                            ctx.drawImage(
                                cobraHeadImg.current,
                                -scaledCellSize / 2,
                                -scaledCellSize / 2,
                                scaledCellSize,
                                scaledCellSize
                            );
                        } else if (index === 1) {
                            const neckDirection = {
                                x: snake[index - 1].x - segment.x,
                                y: snake[index - 1].y - segment.y,
                            }

                            if (neckDirection.x === 1) {
                                ctx.rotate(Math.PI / 2);
                            } else if (neckDirection.x === -1) {
                                ctx.rotate(-Math.PI / 2);
                            } else if (neckDirection.y === 1) {
                                ctx.rotate(Math.PI);
                            } else if (neckDirection.y === -1) {
                                ctx.rotate(0);
                            }

                            ctx.drawImage(
                                cobraNeckImg.current,
                                -cellSize / 2,
                                -cellSize / 2,
                                cellSize,
                                cellSize
                            );
                        } else if (index === snake.length - 1) {
                            const tailDirection = {
                                x: segment.x - snake[index - 1].x,
                                y: segment.y - snake[index - 1].y
                            }

                            if (tailDirection.x === 1) {
                                ctx.rotate(Math.PI / 2);
                            } else if (tailDirection.x === -1) {
                                ctx.rotate(-Math.PI / 2);
                            } else if (tailDirection.y === 1) {
                                ctx.rotate(Math.PI);
                            } else if (tailDirection.y === -1) {
                                ctx.rotate(0);
                            } else {
                                ctx.rotate(Math.PI);
                            }

                            ctx.rotate(Math.PI);

                            ctx.drawImage(
                                cobraTailImg.current,
                                -cellSize / 2,
                                -cellSize / 2,
                                cellSize,
                                cellSize
                            );

                            
                        } else { 
                            const prevSegment = snake[index - 1];
                            const nextSegment = snake[index + 1];

                            const bodyDirection = {
                                x: prevSegment.x - nextSegment.x,
                                y: prevSegment.y - nextSegment.y
                            }

                            if (bodyDirection.x === 0) {
                                ctx.rotate(0);
                            } else if (bodyDirection.y === 0) {
                                ctx.rotate(Math.PI / 2);
                            } else {
                                if (prevSegment.x < segment.x && nextSegment.y < segment.y || nextSegment.x < segment.x && prevSegment.y < segment.y) {
                                    ctx.rotate(Math.PI / 2);
                                } else if (prevSegment.x < segment.x && nextSegment.y > segment.y || nextSegment.x < segment.x && prevSegment.y > segment.y) {
                                    ctx.rotate(Math.PI / 2);
                                }
                            }

                            ctx.drawImage(
                                cobraBodyImg.current,
                                -cellSize / 2,
                                -cellSize / 2,
                                cellSize,
                                cellSize
                            );
                        }

                        ctx.restore();
                    });

                    // Draw the food
                    ctx.drawImage(appleImg.current, food.x * cellSize, food.y * cellSize, cellSize, cellSize);

                    // Draw slow apple
                    ctx.drawImage(slowAppleImg.current, slowApple.x * cellSize, slowApple.y * cellSize, cellSize, cellSize);

                    // Draw fast apple
                    ctx.drawImage(fastAppleImg.current, fastApple.x * cellSize, fastApple.y * cellSize, cellSize, cellSize);
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
                            stopGame();
                        }
                        return prevSnake;
                    }

                    const newSnake = [newHead, ...prevSnake];
                    if (newHead.x === food.x && newHead.y === food.y) {
                        setCurrentScore(currentScore + normalFoodPoints);
                        setFood(generateFood());
                        playEatingSound();
                    } else if (newHead.x === slowApple.x && newHead.y === slowApple.y) {
                        setCurrentScore(currentScore + slowApplePoints);
                        setGameSpeed(100);
                        setTimeout(() => setGameSpeed(50), 5000);
                        setSlowApple({ x: -1, y: -1 });
                        playEatingSound();
                    } else if (newHead.x === fastApple.x && newHead.y === fastApple.y) {
                        setCurrentScore(currentScore + fastApplePoints);
                        setGameSpeed(25);
                        setTimeout(() => setGameSpeed(50), 5000);
                        setFastApple({ x: -1, y: -1 });
                        playEatingSound();
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
            setContextUpdated(true);
        }
    };
    
    useEffect(() => {
        updateScore();
    }, [gameOver, currentScore, user?.latestScore, user?.highscore, setUser, navigate, timer]);

    useEffect(() => {
        if (contextUpdated) {
            navigate("/results"); // Navigate to results page after context is updated
        }
    }, [contextUpdated, navigate]);

    //Timer and countdown --------------------------------------------------------------
    const startCountdown = () => {
        setCountdown(3); // Start countdown at 3 seconds
        const intervalId = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(intervalId);
                    startGame(); // Start game after countdown
                    startTimer();
                }
                return prev - 1;
            });
        }, 1000);
    };
    
    const startTimer = () => {
        setTimer(0);
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }
        const intervaldId = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        setTimerIntervalId(intervaldId);
    }

    const [timerIntervalId, setTimerIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

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
        setSnake([
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
        ]);
        setFood(generateFood());
        setDirection({ x: 1, y: 0 });
        
        const appleInterval = setInterval(() => {
            generateSlowApple();
            generateFastApple();
        }, 30000);
        setAppleIntervalId(appleInterval);
    }

    const stopGame = () => {
        setGameStarted(false);
        setGameOver(true);
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
            setTimerIntervalId(null); // Clear the interval ID state
        }
        if (slowAppleTimer) {
            clearTimeout(slowAppleTimer);
            setSlowAppleTimer(null);
        }
        if (fastAppleTimer) {
            clearTimeout(fastAppleTimer);
            setFastAppleTimer(null);
        }
    };

    // Cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (timerIntervalId) {
                clearInterval(timerIntervalId);
            }
            if (slowAppleTimer) {
                clearTimeout(slowAppleTimer);
            }
            if (fastAppleTimer) {
                clearTimeout(fastAppleTimer);
            }
        };
    }, [timerIntervalId]);

    return (
        <>
            <header className="header-without-back-button">
                <div className="user-logout">
                    <p className="user-info">{user?.userName} {user && <CountryFlag user={user} />}</p>
                </div>
                <Jungle />
            </header>
            <div className="stats-container">
                <p className="current-score">{t("game.current-score")}: {currentScore}</p>
                <p className="timer">{t("game.time")}: {formatTime(timer)}</p>
                <p className="higscore">{t("game.high-score")}: {user?.highscore}</p>
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
                    <button onClick={startCountdown} type="button" className="start-game-button">{t("game.start-game")}</button>
                )}
                {!gameStarted && countdown > 0 && (
                    <div className="countdown">{countdown}</div>
                )}
            </section>
            <img
                src={soundOn ? SoundOnImage : SoundOffImage}
                alt="Sound on/off"
                className="sound-icon"
                onClick={toggleSound}
            />
            
            
            {window.innerWidth < 768 && (
                <PlayButtons
                    direction={direction}
                    setDirection={setDirection}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                    soundOn={soundOn}
                />
            )}
            
        </>
    )
}