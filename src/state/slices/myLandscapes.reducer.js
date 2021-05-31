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
        updateMyLandscape: (state, {payload: { landscape } }) => {
            console.log("action is", landscape);
            const oldOne = state.landscapes.findIndex(el => el.id === landscape.id);
            state.landscapes[oldOne] = landscape;
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
export const { updateMyLandscape, setMyLandscapes, finishMyLandscapesLoading, startMyLandscapesLoading } = myLandscapesSlice.actions;

export default myLandscapesSlice.reducer;
