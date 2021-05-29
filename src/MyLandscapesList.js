import { useSelector } from "react-redux";
// import NFT from "./components/NFT/NFT";
// import NFTOptions from "./components/NFTOptions/NFTOptions";
import LandscapeView from "./components/LandscapeView/LandscapeView";

export default function MyLandscapesList() {
    const myLandscapes = useSelector((state) => state.myLandscapes.landscapes) || [];

    return (
        <fieldset>
            <legend>My Landscapes</legend>
            <ul>
                {myLandscapes.map((l) => (
                    <li key={l.id}>
                        <LandscapeView object={l}/>
                        {/* <NFT dna={l.dna} name={l.name} />
                        <NFTOptions name={l.name} id={l.id} /> */}
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}
