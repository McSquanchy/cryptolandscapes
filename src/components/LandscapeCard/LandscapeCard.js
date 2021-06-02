import { useDispatch } from "react-redux";
import { appNavigate } from "../../state/slices/app.reducer";
import NFT from "../NFT/NFT";
import "./LandscapeCard.css";

export default function LandscapeCard({ landscape: { name, landscapeId, dna } }) {
    const dispatch = useDispatch();
    const navigateToLandscape = () => {
        dispatch(appNavigate({ keyword: "landscape-detail", landscapeId }));
    };
    return (
        <div className="landscape-card" onClick={navigateToLandscape}>
            <li key={landscapeId}>
                <h2 className="LandscapeTitle">{name}</h2>
                <NFT dna={dna} name={name} />
            </li>
        </div>
    );
}
