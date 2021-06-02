import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useMyLandscapes() {
    const { landscapes, loading } = useSelector((state) => state.landscapes);
    const ethAddress = useSelector((state) => state.app.ethAddress);

    const myLandscapes = useMemo(() => {
        return landscapes.filter((landscape) => {
            return landscape.owner?.toLowerCase() === ethAddress?.toLowerCase();
        });
    }, [landscapes, ethAddress]);

    return { myLandscapes, loading };
}

export function useRunningAuctionsFilter(landscapes) {
    const auctions = useMemo(() => {
        return landscapes.filter((landscape) => {
            return landscape.auction.running === true;
        });
    }, [landscapes]);
    return auctions;
}
