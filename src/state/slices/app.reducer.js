import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        initialized: false,
    },
    reducers: {
        finishInit: (state) => {
            state.initialized = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { finishInit } = appSlice.actions;

export default appSlice.reducer;
