export const StartPage = () => {

    const handleNavigation = (path: string) => {
        navigate(path);
    }
    
    return (
        <section>
            <h1>Start Page</h1>
            <p>Welcome to the start page</p>
            <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
        </section>
    );
};

export default StartPage;