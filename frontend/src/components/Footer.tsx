import { useNavigate } from "react-router-dom";

export const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <>
            <ul>
                <li onClick={() => handleNavigation('/privacy-policy')} aria-label="link to privacy policy">
                    Privacy policy
                </li>
                <li>
                    <a href="https://github.com/Pingis2/express-test" aria-label="link to github project">Github project</a>
                </li>
                <li>
                    © Cobra 2025
                </li>
            </ul>
        </>
    );
}

export default Footer;