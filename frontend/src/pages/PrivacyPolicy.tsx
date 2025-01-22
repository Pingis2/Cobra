import { BackButton } from "../components/BackButton"


export const PrivacyPolicy = () => {

    return (
        <>
            <BackButton />
            <section className="privacy-policy-container">
                <h1>Privacy Policy</h1>
                <section className="privacy-policy-intro">
                    <h2>Effective Data: January 2025</h2>
                    <p>
                        Cobra-game is committed to protecting your privacy.
                        This Privacy Policy explains how I collect, use, and safeguard your information when
                        you use our game and services. By using my game, you agree to the terms of this Privacy Policy.
                    </p>
                </section>

                <section className="text-container">
                    <section className="privacy-policy-1">
                    <h2>1. Information I collect</h2>
                        <p>
                            I collect the following information when you create an account or use my services:
                        </p>
                        <ul>
                            <li>
                                Username: To identify you in the game and on the leaderboard.
                            </li>
                            <li>
                                Country: To display your country on the leaderboard.
                            </li>
                            <li>
                                Password: Your password is securely encrypted and stored in my database.
                            </li>
                            <li>
                                Score Data: I store your game scores and update your high score if your latest score is higher.
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-2">
                        <h2>2. How I Use Your Information</h2>
                        <p>
                            I use your information for the following purposes:
                        </p>

                        <ul>
                            <li>
                                To create and manage your account.
                            </li>
                            <li>
                                To update and display your scores on the leaderboard.
                            </li>
                            <li>
                                To improve the game experience.
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-3">
                        <h2>3. Data Security</h2>
                        <p>
                            I take your data security seriously:
                        </p>
                        <ul>
                            <li>
                                Your password is encrypted and cannot be accessed in its original form.
                            </li>
                            <li>
                                Your data is stored securely in a MongoDB database, and access is limited to authorized personnel only.
                            </li>
                        </ul>
                    </section>

                    <section className="privacy-policy-4">
                        <h2>4. Data Sharing</h2>
                        <p>
                            I do not share your personal information, including usernames, countries, or scores, with third parties unless required by law.
                        </p>
                    </section>

                    <section className="privacy-policy-5">
                        <h2>5. Your Rights</h2>
                        <p>
                            You have the right to:
                        </p>
                        <ul>
                            <li>
                                Access the data we store about you.
                            </li>
                            <li>
                                Request the deletion of your account and associated data.
                            </li>
                            <li>
                                Update your account information.
                            </li>
                        </ul>
                        <p>
                            To exercise these rights, please contact me at anton@medieinstitutet.se.
                        </p>
                    </section>

                    <section className="privacy-policy-6">
                        <h2>6. Changes to This Privacy Policy</h2>
                        <p>
                            I may update this Privacy Policy from time to time. Changes will be posted with the updated "Effective Date." Continued use of the game constitutes acceptance of the revised policy.
                        </p>
                    </section>

                    <section className="privacy-policy-7">
                        <h2>7. Contact Us</h2>
                        <p>
                            If you have questions or concerns about this Privacy Policy, please contact me at anton@medieinstitutet.se
                        </p>
                        </section>
                </section>
            </section>
        </>
    )
}