import MovementUp from '../assets/sounds/movement-up-1.wav';
import MovementDown from '../assets/sounds/movement-down-1.wav';
import MovementLeft from '../assets/sounds/movement-left-1.wav';
import MovementRight from '../assets/sounds/movement-right-1.wav';

export const MovementSounds = () => {
    const movementUp = () => {
        const audio = new Audio(MovementUp);
        audio.play();
    }

    const movementDown = () => {
        const audio = new Audio(MovementDown);
        audio.play();
    }

    const movementLeft = () => {
        const audio = new Audio(MovementLeft);
        audio.play();
    }

    const movementRight = () => {
        const audio = new Audio(MovementRight);
        audio.play();
    }

    return {
        movementUp,
        movementDown,
        movementLeft,
        movementRight
    }
}