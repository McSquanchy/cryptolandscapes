import { createSlice } from "@reduxjs/toolkit";

export const lotterySlice = createSlice({
    name: "lottery",
    initialState: {
        participating: false,
        locked: false,
    },
    reducers: {
        addParticipation: (state) => {
            state.participating = true;
        },
        delParticipation: (state) => {
            state.participating = false;
        },
        lockLottery: (state) => {
            state.locked = true;
        },
        unlockLottery: (state) => {
            state.locked = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { delParticipation, addParticipation, lockLottery, unlockLottery } = lotterySlice.actions;

export default lotterySlice.reducer;
