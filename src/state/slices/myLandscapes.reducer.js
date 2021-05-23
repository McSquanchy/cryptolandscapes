import { createSlice } from "@reduxjs/toolkit";

export const myLandscapesSlice = createSlice({
    name: "myLandscapes",
    initialState: {
        landscapes: [],
        loading: true,
    },
    reducers: {
        setMyLandscapes: (state, { payload: { landscapes } }) => {
            console.log("action is", landscapes);
            state.landscapes = landscapes;
        },
        finishMyLandscapesLoading: (state) => {
            state.loading = false;
        },
        startMyLandscapesLoading: (state) => {
            state.loading = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setMyLandscapes, finishMyLandscapesLoading, startMyLandscapesLoading } = myLandscapesSlice.actions;

export default myLandscapesSlice.reducer;
