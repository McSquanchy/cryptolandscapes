import { useSelector } from "react-redux";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function AllLandscapesList() {
    const { landscapes, loading } = useSelector((state) => state.landscapes);

    if (loading) {
        return <div>Loading</div>;
    } else {
        return (
            <>
                <h2>My landscapes</h2>
                <LandscapesList landscapes={landscapes} />
            </>
        );
    }
}
