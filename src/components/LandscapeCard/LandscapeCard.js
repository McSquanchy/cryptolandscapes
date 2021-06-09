import { navTo } from "../../nav";
import NFT from "../NFT/NFT";
import "./LandscapeCard.css";

export default function LandscapeCard({ landscape: { name, landscapeId, dna } }) {
    const navigateToLandscape = () => {
        navTo({ keyword: "landscape-detail", landscapeId });
    };
    return (
        <div className="landscape-card" onClick={navigateToLandscape}>
            <NFT dna={dna} />
            <h2 className="landscape-title">{name}</h2>
        </div>
    );
}
