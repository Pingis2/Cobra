import CobraTheme from '../assets/music/Cobra-theme.wav';

export const ThemeSong = () => {
    const audio = new Audio(CobraTheme);
    audio.loop = true;
    audio.play();

    return null;
}
