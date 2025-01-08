import SwedenFlag from "../assets/images/dropdown-flags/sweden-flag.png";
import AmericanFlag from "../assets/images/dropdown-flags/american-flag.png";
import EnglandFlag from "../assets/images/dropdown-flags/england-flag.png";
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
        }
    }

    return (
        <img src={user ? countryImage(user) : ""} alt={`flag of ${user?.country}`}  className="user-country"/>
    )
}