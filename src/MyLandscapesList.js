import { useSelector } from "react-redux";
// import NFT from "./components/NFT/NFT";
// import NFTOptions from "./components/NFTOptions/NFTOptions";
import LandscapeView from "./components/LandscapeView/LandscapeView";

export default function MyLandscapesList() {
    const myLandscapes = useSelector((state) => state.myLandscapes.landscapes) || [];

    return (
        <fieldset>
            <legend>My Landscapes</legend>
            <ul className="MyLandscapes">
                {myLandscapes.map((l) => (
                    <LandscapeView  object={l}  />
                ))}
            </ul>
        </fieldset>
    );
}
