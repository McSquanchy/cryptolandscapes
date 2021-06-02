import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        initialized: false,
        navState: {keyword: 'my-landscapes'}
    },
    reducers: {
        finishInit: (state) => {
            state.initialized = true;
        },
        appNavigate: (state, {payload}) => {
            state.navState = {...payload};
        }
    },
});

// Action creators are generated for each case reducer function
export const { finishInit, appNavigate } = appSlice.actions;

export default appSlice.reducer;
