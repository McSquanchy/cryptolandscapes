import { useSelector } from "react-redux";
import { Loader } from "rsuite";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function AllLandscapesList() {
    const { landscapes, loading } = useSelector((state) => state.landscapes);

    if (loading) {
        return <Loader size="lg"  center/>;
    } else {
        return (
            <>
                <h2>All landscapes</h2>
                <LandscapesList landscapes={landscapes} />
            </>
        );
    }
}
