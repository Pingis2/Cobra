import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";
import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.webp";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.webp";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.webp";
import CanadaFlag from "../assets/images/dropdown-flags/canada-flag.webp";


export const CreateUser = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState({ name: "", flag: "" });
    const [highscore] = useState(0);
    const [error, setError] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const retryCreateUser = async (
        userName: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        country: string,
        highscore: number,
        retries: number = 10,
        delay: number = 2000) => {
            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    const response = await createUser(userName, firstName, lastName, email, password, country, highscore);
                    return response;
                } catch (error) {
                    if (attempt < retries - 1) {
                        console.error(`Retrying login (${attempt + 1}/${retries})...`);
                        await new Promise((resolve) => setTimeout(resolve, delay));
                    } else {
                        throw error;
                    }
                }
            }
        };

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await retryCreateUser(userName, firstName, lastName, email, password, country.name, highscore);

            if (data) {
                navigate("/");
            } else {
                setError("Failed to create user");
            }
        } catch (error: any) {
            console.error("Error during user creation:", error);
            if (error.response) {
                // Handle specific HTTP errors
                if (error.response.status === 409) {
                    setError("User already exists");
                } else {
                    setError("An error occurred during user creation");
                }
            } else {
                setError("Network or server error");
            }
        } finally {
            setLoading(false);
        }
        
    }

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <>
            {loading ? (
                <p className="loading-text">Creating account, please wait<span className="dots"></span>
                </p>
            ) : (
                <>
                    <h1>Create Account</h1>
                    <section className="create-user-container">
                        <form className="create-user-form" onSubmit={handleCreateUser}>
                            <div className="input-container">
                                <label htmlFor="firstName">First name:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Mark" 
                                    className="first-name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    minLength={2}
                                    maxLength={20}
                                    pattern="[A-Öa-ö]+$"
                                    title="First name should only contain letters between 2 and 20 characters"
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="lastName">Last name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Smith"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    minLength={2}
                                    maxLength={30}
                                    pattern="[A-Öa-ö]+$"
                                    title="Last name should only contain letters between 2 and 30 characters"
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="MarkSmith12"
                                    className="user-name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                    minLength={4}
                                    maxLength={15}
                                    pattern="[A-Öa-ö0-9]+$"
                                    title="Username should only contain letters and numbers between 4 and 15 characters"
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="email"
                                    placeholder="mark@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={50}
                                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                    title="Email should be in the format test@email.com"
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="password"
                                    placeholder="Password123!"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    pattern="^(?=.*[A-ÅÄÖa-åäö])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&åäö-]{8,}$"
                                    title="Password must contain at least 8 characters, one letter, one number and one special character"
                                />
                            </div>

                            <div className="dropdown-container">
                                <div>Country</div>
                                <div
                                    className="chosen-country"
                                    onClick={handleDropdown}
                                >
                                    <div className="country">
                                        {country.name ? (
                                            <>
                                                <span>{country.name}</span>
                                                <img src={country.flag} alt={`${country.name} flag`} className="dropdown-flag" />
                                            </>
                                        ) : (
                                            "Choose country"
                                        )}
                                    </div>
                                    <svg
                                        width="21px" height="21px" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_down [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#ffffff]"> </path> </g> </g> </g> </g>
                                    </svg>
                                </div>
                                {showDropdown &&
                                    <div className="dropdown">
                                        <ul>
                                            <li onClick={() => {
                                                setCountry({ name: "Sweden", flag: SwedenFlag })
                                                setShowDropdown(false);
                                            }}>
                                                <p>Sweden</p>
                                                <img
                                                    src={SwedenFlag}
                                                    alt="Sweden flag"
                                                    className="dropdown-flag"
                                                />
                                            </li>
                                            <li onClick={() => {
                                                setCountry({ name: "USA", flag: AmericanFlag })
                                                setShowDropdown(false);
                                            }}>
                                                <p>USA</p>
                                                <img
                                                    src={AmericanFlag}
                                                    alt="USA flag"
                                                    className="dropdown-flag"
                                                />
                                            </li>
                                            <li onClick={() => {
                                                setCountry({ name: "England", flag: EnglandFlag })
                                                setShowDropdown(false);
                                            }}>
                                            <p>England</p>
                                            <img
                                                src={EnglandFlag}
                                                alt="England flag"
                                                className="dropdown-flag"
                                            />
                                            </li>
                                            <li onClick={() => {
                                                setCountry({ name: "Canada", flag: CanadaFlag })
                                                setShowDropdown(false);
                                            }}>
                                                <p>Canada</p>
                                                <img
                                                    src={CanadaFlag}
                                                    alt="Canadian flag"
                                                    className="dropdown-flag"
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>
                            {error && <p>{error}</p>}
                            <button type="submit">Create account</button>
                        </form>

                        <p onClick={() => handleNavigation('/')} className="login-link">Already have an account? Click here to log in</p>
                    </section>
                </>
            )}
        </>
    );
}

export default CreateUser;