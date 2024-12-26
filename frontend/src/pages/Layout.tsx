import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";


export const Layout = () => {
    return (
        <>
            <main>
                <Outlet />
            </main>
            <Footer></Footer>
            
        </>
    );
}

export default Layout;