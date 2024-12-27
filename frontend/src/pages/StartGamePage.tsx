import LogoutButton from "../components/Logout";
import { useUser } from "../context/UserContext";


export const StartGamePage = () => {
    const { user } = useUser();

    return (
        <>

            <header>
                    <LogoutButton />
                    <p className="user-info">{user?.firstName} {user?.country}</p>
            </header>

            <div>
                <h1>Start Game</h1>
                <p>Click the button below to start the game.</p>
                <button>Start Game</button>
            </div>
        </>
    );
}