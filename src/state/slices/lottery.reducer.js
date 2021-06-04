import { createSlice } from "@reduxjs/toolkit";

export const lotterySlice = createSlice({
    name: "lottery",
    initialState: {
        participating: false,
        locked: false,
        myShares: 0,
        totalShares: 0,
        participants: []
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
        setMyShares:(state, { payload: amountOfShares }) => {
            state.myShares = amountOfShares;
        },
        setTotalShares: (state, {payload: amountOfShares}) => {
            state.totalShares = amountOfShares;
        },
        setParticipants: (state, {payload: participants}) => {
            state.participants = participants;
        },
        addLatestParticipant: (state, {payload: participant}) => {
            if(!state.participants.includes(participant)) {
                state.participants = [...state.participants, participant];
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const { delParticipation, addParticipation, lockLottery, unlockLottery, setMyShares, setTotalShares, setParticipants, addLatestParticipant } = lotterySlice.actions;
export default lotterySlice.reducer;
