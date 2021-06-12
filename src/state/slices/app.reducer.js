import { createSlice } from "@reduxjs/toolkit";


const INITAL_NAV_STATE = { keyword: "my-landscapes" };
const getPersistedNavState = () => {
    try {
        let hash = window.location.hash;
        if (hash.startsWith("#")) hash = hash.substring(1);
        const data = JSON.parse(window.atob(decodeURIComponent(hash)));
        if (data.keyword) {
            return data;
        } else {
            return INITAL_NAV_STATE;
        }
    } catch (e) {
        return INITAL_NAV_STATE;
    }
};

export const appSlice = createSlice({
    name: "app",
    initialState: {
        initialized: false,
        navState: getPersistedNavState(),
        ethAddress: null,
        owner: false,
        error: null,
        withdrawableEth: 0,
        isWithdrawing: false,
    },
    reducers: {
        finishInit: (state) => {
            state.initialized = true;
        },
        appNavigate: (state, { payload }) => {
            state.navState = { ...payload };
        },
        setMyETHAddress: (state, { payload }) => {
            state.ethAddress = payload;
        },
        setOwner: (state, {payload}) => {
            state.owner = payload;
        },
        setAppError: (state, {payload}) => {
            state.error = payload;
        },
        setWithDrawableEth: (state, {payload}) => {
            state.withdrawableEth = payload;
        },
        setIsWithdrawing: (state, {payload}) => {
            state.isWithdrawing = payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const { finishInit, appNavigate, setMyETHAddress, setOwner, setAppError, setWithDrawableEth, setIsWithdrawing } = appSlice.actions;

export default appSlice.reducer;

