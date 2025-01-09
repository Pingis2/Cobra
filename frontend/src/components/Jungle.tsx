import Jungle1 from "../assets/images/jungle/jungle-1.png";
import Jungle2 from '../assets/images/jungle/jungle-2.png';
import Jungle3 from '../assets/images/jungle/jungle-3.png';
import Jungle4 from '../assets/images/jungle/jungle-4.png';

export const Jungle = () => {
    return (
        <div>
            <img src={Jungle1} alt="Jungle" className="jungle-1" />
            <img src={Jungle2} alt="Jungle" className="jungle-2" />
            <img src={Jungle3} alt="Jungle" className="jungle-3" />
            <img src={Jungle4} alt="Jungle" className="jungle-4" />
        </div>
    )
}