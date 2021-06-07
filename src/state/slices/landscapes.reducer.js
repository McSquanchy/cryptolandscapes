import { createSlice } from "@reduxjs/toolkit";

export const landscapesSlice = createSlice({
    name: "landscapes",
    initialState: {
        landscapes: [],
        loading: true,
        uiState: {},
    },
    reducers: {
        setLandscapes: (state, { payload: landscapes }) => {
            state.landscapes = landscapes;
        },
        updateLandscape: (state, { payload: landscape }) => {
            state.landscapes[Number(landscape.landscapeId)] = landscape;
        },
        finishLandscapesLoading: (state) => {
            state.loading = false;
        },
        startLandscapesLoading: (state) => {
            state.loading = true;
        },
        setBidHistory: (state, { payload: { landscapeId, bids } }) => {
            state.landscapes[Number(landscapeId)].auction.bids = bids;
        },
        addAuctionBid: (state, { payload: { auctionId, landscapeId, bidder, amount, time } }) => {
            state.landscapes[Number(landscapeId)].auction.bids.unshift({ auctionId, landscapeId, bidder, amount, time });
        },
        setOwnerHistory: (state, { payload: { landscapeId, ownerHistory } }) => {
            state.landscapes[Number(landscapeId)].ownerHistory = [...ownerHistory];
        },
        setLandscapeUiState: (state, { payload: { landscapeId, topic, value } }) => {
            state.uiState[Number(landscapeId)] = {
                ...state.uiState[landscapeId],
                [topic]: value,
            };
        },
    },
});

// Action creators are generated for each case reducLer function
export const {
    updateLandscape,
    setLandscapes,
    addAuctionBid,
    finishLandscapesLoading,
    setLandscapeUiState,
    startLandscapesLoading,
    setBidHistory,
    setOwnerHistory,
} = landscapesSlice.actions;

export default landscapesSlice.reducer;
