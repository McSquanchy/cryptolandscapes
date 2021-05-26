import { createSlice } from "@reduxjs/toolkit";

export const auctionsSlice = createSlice({
    name: "auctions",
    initialState: {
        auctions: []
    },
    reducers: {
        setAuctions: (state, { payload: { auctions } }) => {
            console.log("action is", auctions);
            state.auctions = auctions;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setAuctions } = auctionsSlice.actions;

export default auctionsSlice.reducer;
