import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app.reducer";
import lotteryReducer from "./slices/lottery.reducer";
import auctionsReducer from "./slices/auctions.reducer";
import landscapesReducer from "./slices/landscapes.reducer";

export default configureStore({
    reducer: {
        landscapes: landscapesReducer,
        app: appReducer,
        lottery: lotteryReducer,
        auctions: auctionsReducer
    },
});
