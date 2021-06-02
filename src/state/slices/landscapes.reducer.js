import { createSlice } from "@reduxjs/toolkit";

export const landscapesSlice = createSlice({
    name: "landscapes",
    initialState: {
        landscapes: [],
        loading: true,
        uiState: {},
    },
    reducers: {
        setLandscapes: (state, { payload: landscapes }) => {
            state.landscapes = landscapes;
        },
        updateLandscape: (state, { payload: landscape }) => {
            state.landscapes[landscape.landscapeId] = landscape;
        },
        finishLandscapesLoading: (state) => {
            state.loading = false;
        },
        startLandscapesLoading: (state) => {
            state.loading = true;
        },
        setLandscapeUiState: (state, { payload: { landscapeId, topic, value } }) => {
            state.uiState[landscapeId] = {
                ...state.uiState[landscapeId],
                [topic]: value,
            };
        },
    },
});

// Action creators are generated for each case reducLer function
export const { updateLandscape, setLandscapes, finishLandscapesLoading, setLandscapeUiState, startLandscapesLoading } = landscapesSlice.actions;

export default landscapesSlice.reducer;
