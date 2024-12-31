import { useUser } from "../context/UserContext";


export const Results = () => {
    const { user } = useUser();
    console.log(user?.latest_score);
    

    return (
        <div>
            <h1>Results</h1>
            <p>{user?.highscore} { user?.latest_score }</p>
        </div>
    )
}