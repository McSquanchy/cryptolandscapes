import { useSelector } from "react-redux";
import { Loader } from "rsuite";
import { useAccountLandscapes, useRunningAuctionsFilter } from "../hooks/landscapes";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function MyAuctionsList() {
    const myAddress = useSelector((state) => state.app.ethAddress);
    const {myLandscapes, loading} = useAccountLandscapes(myAddress);
    const myAuctions = useRunningAuctionsFilter(myLandscapes);

    if (loading) {
        return <Loader size="lg" center />;
    } else {
        return (
            <>
                <h2>My auctions</h2>
                <LandscapesList landscapes={myAuctions} />
            </>
        );
    }
}
