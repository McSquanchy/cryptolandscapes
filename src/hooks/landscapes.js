import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLandscapeUiState } from "../state/slices/landscapes.reducer";

export function useAccountLandscapes(ethAddress) {
    const { landscapes, loading } = useSelector((state) => state.landscapes);

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

export function useIsUserOwner(landscape) {
    const ethAddress = useSelector((state) => state.app.ethAddress);

    return landscape.owner?.toLowerCase() === ethAddress?.toLowerCase();
}

export function useUiState(landscapeId, topic) {
    const dispatch = useDispatch();
    const landscapeUiState = useSelector((state) => state.landscapes.uiState[landscapeId]);

    const turnOn = useCallback(() => {
        dispatch(setLandscapeUiState({ landscapeId, topic, value: true }));
    }, [dispatch, landscapeId, topic]);

    const turnOff = useCallback(() => {
        dispatch(setLandscapeUiState({ landscapeId, topic, value: false }));
    }, [dispatch, landscapeId, topic]);

    const uiState = landscapeUiState == null ? false : landscapeUiState[topic] || false;
    return [uiState, turnOn, turnOff];
}
