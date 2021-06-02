import LandscapeCard from "../LandscapeCard/LandscapeCard";
import "./LandscapesList.css";

export default function LandscapesList({ landscapes }) {
    return (
        <div class="landscapes-list">
            {landscapes.map((l) => (
                <LandscapeCard key={l.id} landscape={l} />
            ))}
        </div>
    );
}
