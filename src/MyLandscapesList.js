import { useSelector } from "react-redux";
import NFT from "./components/NFT/NFT";
import contractService from "./web3/contract.service";

export default function MyLandscapesList() {
    const myLandscapes = useSelector((state) => state.myLandscapes.landscapes) || [];

    return (
        <fieldset>
            <legend>My Landscapes</legend>
            <ul>
                {myLandscapes.map((l) => (
                    <li key={l.id}>
                        <NFT dna={l.dna} />
                        <button type="button" onClick={() => contractService.startAuction(l.id, Math.ceil(Date.now() / 1000) + 60, 0)}>Start auction</button>
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}
