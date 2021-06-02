import { useMyLandscapes, useRunningAuctionsFilter } from "../hooks/landscapes";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function MyAuctionsList() {
    const { myLandscapes, loading } = useMyLandscapes();
    const myAuctions = useRunningAuctionsFilter(myLandscapes);

    if (loading) {
        return <div>Loading</div>;
    } else {
        return (
            <>
                <h2>My auctions</h2>
                <LandscapesList landscapes={myAuctions} />
            </>
        );
    }
}
