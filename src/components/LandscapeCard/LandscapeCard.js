import { navTo } from "../../nav";
import NFT from "../NFT/NFT";
import "./LandscapeCard.css";

export default function LandscapeCard({ landscape: { name, landscapeId, dna } }) {
    const navigateToLandscape = () => {
        navTo({ keyword: "landscape-detail", landscapeId });
    };
    return (
        <div className="landscape-card" onClick={navigateToLandscape}>
            <h2 className="LandscapeTitle">{name}</h2>
            <NFT dna={dna} style={{ width: 300 }} />
        </div>
    );
}
