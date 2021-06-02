import { createSlice } from "@reduxjs/toolkit";

export const landscapesSlice = createSlice({
    name: "landscapes",
    initialState: {
        landscapes: [],
        loading: true,
    },
    reducers: {
        setLandscapes: (state, { payload: landscapes }) => {
            state.landscapes = landscapes;
        },
        updateLandscape: (state, {payload: { landscape } }) => {
            console.log("action is", landscape);
            const oldOne = state.landscapes.findIndex(el => el.id === landscape.id);
            state.landscapes[oldOne] = landscape;
        },
        finishLandscapesLoading: (state) => {
            state.loading = false;
        },
        startLandscapesLoading: (state) => {
            state.loading = true;
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateLandscape, setLandscapes, finishLandscapesLoading, startLandscapesLoading } = landscapesSlice.actions;

export default landscapesSlice.reducer;
