import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IUsers } from "../models/IUsers";
import axios from "axios";

export const StartPage = () => {
    const [user, setUser] = useState<IUsers | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/get-user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.user) {
                setUser(response.data.user); // Assuming response contains user data
            } else {
                setError('User not found');
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError('Failed to load user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []); // Ensure this runs once when the component mounts


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <section>
            <h1>Start Page</h1>
            <p>Welcome {user?.userName} to the start page</p>
            <button onClick={() => handleNavigation('/leaderboard')} type="submit">Leaderboard</button>
        </section>
    );
};

export default StartPage;