import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";


export const Layout = () => {
    return (
        <>
            <main>
                <Outlet />
            </main>
            <footer><Footer /></footer>
            
            
        </>
    );
}

export default Layout;