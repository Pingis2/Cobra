import { useTranslation } from "react-i18next";

export const BackButton = () => {
    const { t } = useTranslation();

    return (
        <>
            <button type="submit" onClick={() => window.history.back()} className="back-button">{t("back-button")}</button>
        </>
    );
}