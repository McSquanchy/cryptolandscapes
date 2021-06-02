import LandscapeCard from "../LandscapeCard/LandscapeCard";
import "./LandscapesList.css";

export default function LandscapesList({ landscapes }) {
    return (
        <div className="landscapes-list">
            {landscapes.map((l) => (
                <LandscapeCard key={l.lanscapeId} landscape={l} />
            ))}
        </div>
    );
}
