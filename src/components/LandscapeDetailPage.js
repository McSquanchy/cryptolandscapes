import LandscapeDetailView from "./LandscapeDetailView/LandscapeDetailView";

export default function LandscapeDetailPage({ landscapeId }) {

    const landscape = null;

    if (landscape == null) {
        return <div>Loading</div>;
    } else {
        return <LandscapeDetailView landscape={landscape} />;
    }
}
