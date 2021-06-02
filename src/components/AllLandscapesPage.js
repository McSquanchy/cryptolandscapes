import { useSelector } from "react-redux";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function AllLandscapesList() {
    // TODO display all landscapes
    const allLandscapes = useSelector((state) => state.myLandscapes.landscapes);
    return (
        <>
            <h2>All landscapes</h2>
            <LandscapesList landscapes={allLandscapes} />
        </>
    );
}
