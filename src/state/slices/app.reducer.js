import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        initialized: false,
        navState: {keyword: 'my-landscapes'},
        ethAddress: null
    },
    reducers: {
        finishInit: (state) => {
            state.initialized = true;
        },
        appNavigate: (state, {payload}) => {
            state.navState = {...payload};
        },
        setMyETHAddress: (state, {payload }) => {
            state.ethAddress = payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const { finishInit, appNavigate,setMyETHAddress } = appSlice.actions;

export default appSlice.reducer;
