import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footers";
import { Header } from "../components/Header";


export const Layout = () => {
    return (
        <>
            <header>
                <Header></Header>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </>
    );
}

export default Layout;