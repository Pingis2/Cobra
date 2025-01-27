import { useTranslation } from "react-i18next";
import EnglishFlagIcon from '../assets/images/dropdown-flags/england-flag.webp';
import SwedenFlagIcon from '../assets/images/dropdown-flags/sweden-flag.webp';

export const LanguageToggle = () => {
    const { i18n, t } = useTranslation();
    
    return (
        <>
            <div
                className="language-container"
                onClick={() =>
                i18n.changeLanguage(
                    i18n.resolvedLanguage === 'en' ? 'sv' : 'en'
                )}
            >
                <p>{t("change-language")}</p>
                <img src={
                        i18n.resolvedLanguage === 'en' ? SwedenFlagIcon : EnglishFlagIcon
                    }
                    alt={`Switch to ${i18n.resolvedLanguage === 'en' ? 'Swedish' : 'English'}`}
                    className="language-toggle-icon"
                    
                    title={`Switch to ${i18n.resolvedLanguage === 'en' ? 'Swedish' : 'English'}`}
                />
            </div>
        </>
    )
    
}