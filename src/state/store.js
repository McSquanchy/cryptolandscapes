import { configureStore } from "@reduxjs/toolkit";
import myLandscapesReducer from "./slices/myLandscapes.reducer";
import appReducer from "./slices/app.reducer";
import lotteryReducer from "./slices/lottery.reducer";

export default configureStore({
    reducer: {
        myLandscapes: myLandscapesReducer,
        app: appReducer,
        lottery: lotteryReducer,
    },
});
