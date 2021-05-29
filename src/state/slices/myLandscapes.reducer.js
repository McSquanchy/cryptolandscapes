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
        setMyLandscape: (state, {payload: { landscape } }) => {
            console.log("action is", landscape);
            const oldOne = state.landscapes.filter(el => el.id === landscape.id)[0];
            state.landscapes[state.landscapes.indexOf(oldOne)] = landscape;
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
export const { setMyLandscape, setMyLandscapes, finishMyLandscapesLoading, startMyLandscapesLoading } = myLandscapesSlice.actions;

export default myLandscapesSlice.reducer;
