import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const Header = () => {
    const { user } = useContext(UserContext);

    return (
        <>
            <header>
                <p>{user?.userName} {user?.country}</p>
            </header>
        </>
    );
}

export default Header