import { createSlice } from "@reduxjs/toolkit";

export const lotterySlice = createSlice({
    name: "lottery",
    initialState: {
        participating: false,
        locked: false,
        myShares: 0,
        totalShares: 0,
        participants: [],
        availableWinWithdrawals: 0,
        showWithdrawModal: false,
        withdrawLocked: false,
        selectedShares: 1,
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
        lockAdminLottery: (state) => {
            state.adminLocked = true;
        },
        unlockAdminLottery: (state) => {
            state.adminLocked = false;
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
        },
        setAvailableWinWithdrawals: (state, {payload: nrOfAvailableWithdrawals }) => {
           state.availableWinWithdrawals = Number(nrOfAvailableWithdrawals);
        },
        setShowWithdrawModal: (state, {payload: show}) => {
            state.showWithdrawModal = show;
        },
        lockWithdraw: (state) => {
            state.withdrawLocked = true;
        },
        unlockWithdraw: (state) => {
            state.withdrawLocked = false;
        },
        setSelectedShares: (state, {payload: amount}) => {
            state.selectedShares = amount;
        }
    },
});

// Action creators are generated for each case reducer function
export const { delParticipation, addParticipation, lockLottery, unlockLottery, lockAdminLottery, unlockAdminLottery, setMyShares, setTotalShares, setParticipants, addLatestParticipant, setAvailableWinWithdrawals, setShowWithdrawModal, lockWithdraw, unlockWithdraw, setSelectedShares } = lotterySlice.actions;
export default lotterySlice.reducer;
