import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.webp";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.webp";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.webp";
import CanadaFlag from "../assets/images/dropdown-flags/england-flag.webp";
import { IUsers } from "../models/IUsers";

interface CountryFlagProps {
    user: IUsers;
}


export const CountryFlag = ({user}: CountryFlagProps) => {

    const countryImage = (user: IUsers) => {
        if (user?.country === "England") {
            return EnglandFlag;
        } else if (user?.country === "Sweden") {
            return SwedenFlag;
        } else if (user?.country === "USA") {
            return AmericanFlag;
        } else if (user?.country === "Canada") {
            return CanadaFlag;
        }
    }

    return (
        <img src={user ? countryImage(user) : ""} alt={`flag of ${user?.country}`}  className="user-country" loading="lazy" width={50} height={30}/>
    )
}