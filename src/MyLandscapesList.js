import { useSelector } from "react-redux";
import NFT from "./components/NFT/NFT";

export default function MyLandscapesList() {
    const myLandscapes = useSelector((state) => state.myLandscapes.landscapes) || [];

    return (
        <fieldset>
            <legend>My Landscapes</legend>
            <ul>
                {myLandscapes.map((l) => (
                    <li key={l.id}>
                        <NFT dna={l.dna} />
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}
