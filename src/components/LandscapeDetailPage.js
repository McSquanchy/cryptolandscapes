import { useSelector } from "react-redux";
import { Loader } from "rsuite";
import LandscapeDetailView from "./LandscapeDetailView/LandscapeDetailView";

export default function LandscapeDetailPage({ landscapeId }) {
    const { landscapes, loading } = useSelector((state) => state.landscapes);

    const landscape = landscapes[Number(landscapeId)];

    if (loading) {
        return <Loader size="lg" center />;
    } else if (landscape == null) {
        return <h2>Landscape with id {landscapeId} not found</h2>;
    } else {
        return <LandscapeDetailView landscape={landscape} />;
    }
}
