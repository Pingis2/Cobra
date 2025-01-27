import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <>
            <ul>
                <li onClick={() => handleNavigation('/privacy-policy')} aria-label="link to privacy policy" className="privacy-policy-link">
                    {t("footer.privacy-policy")}
                </li>
                <li>
                    <a href="https://github.com/Pingis2/express-test" aria-label="link to github project">{t("footer.github")}</a>
                </li>
            </ul>
            <p className="copyright">
                © Cobra 2025
            </p>
        </>
    );
}

export default Footer;