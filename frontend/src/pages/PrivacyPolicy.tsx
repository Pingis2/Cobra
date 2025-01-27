import { useTranslation } from "react-i18next";
import { BackButton } from "../components/BackButton"


export const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <>
            <BackButton />
            <section className="privacy-policy-container">
                <h1>{t("privacy-policy.title")}</h1>
                <section className="privacy-policy-intro">
                    <h2>{t("privacy-policy.privacy-policy-intro.title")}</h2>
                    <p>
                        {t("privacy-policy.privacy-policy-intro.text")}
                    </p>
                </section>

                <section className="text-container">
                    <section className="privacy-policy-1">
                        <h2>{t("privacy-policy.privacy-policy-1.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-1.intro")}
                        </p>
                        <ul>
                            <li>
                                {t("privacy-policy.privacy-policy-1.list.item-1")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-1.list.item-2")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-1.list.item-3")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-1.list.item-4")}
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-2">
                        <h2>{t("privacy-policy.privacy-policy-2.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-2.intro")}
                        </p>

                        <ul>
                            <li>
                                {t("privacy-policy.privacy-policy-2.list.item-1")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-2.list.item-2")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-2.list.item-3")}
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-3">
                        <h2>{t("privacy-policy.privacy-policy-3.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-3.intro")}
                        </p>
                        <ul>
                            <li>
                                {t("privacy-policy.privacy-policy-3.list.item-1")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-3.list.item-2")}
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-4">
                        <h2>{t("privacy-policy.privacy-policy-4.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-4.intro")}
                        </p>
                    </section>

                    <section className="privacy-policy-5">
                        <h2>{t("privacy-policy.privacy-policy-5.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-5.intro")}
                        </p>
                        <ul>
                            <li>
                                {t("privacy-policy.privacy-policy-5.list.item-1")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-5.list.item-2")}
                            </li>
                            <li>
                                {t("privacy-policy.privacy-policy-5.list.item-3")}
                            </li>
                        </ul>
                        <p>
                            {t("privacy-policy.privacy-policy-5.contact")}
                        </p>
                    </section>

                    <section className="privacy-policy-6">
                        <h2>{t("privacy-policy.privacy-policy-6.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-6.intro")}
                        </p>
                    </section>

                    <section className="privacy-policy-7">
                        <h2>{t("privacy-policy.privacy-policy-7.title")}</h2>
                        <p>
                            {t("privacy-policy.privacy-policy-7.intro")}
                        </p>
                        </section>
                </section>
            </section>
        </>
    )
}