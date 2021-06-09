import { useSelector } from "react-redux";
import { Loader } from "rsuite";
import { useRunningAuctionsFilter } from "../hooks/landscapes";
import LandscapesList from "./LandscapesList/LandscapesList";

export default function AllAuctionsList() {
    const { landscapes, loading } = useSelector((state) => state.landscapes);
    const allAuctions = useRunningAuctionsFilter(landscapes);

    if (loading) {
        return <Loader size="lg" center />
    } else {
        return (
            <>
                <h2>All auctions</h2>
                <LandscapesList landscapes={allAuctions} />
            </>
        );
    }
}
