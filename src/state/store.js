import { configureStore } from "@reduxjs/toolkit";
import appReducer, {appNavigate} from "./slices/app.reducer";
import lotteryReducer from "./slices/lottery.reducer";
import auctionsReducer from "./slices/auctions.reducer";
import landscapesReducer from "./slices/landscapes.reducer";

const store = configureStore({
    reducer: {
        landscapes: landscapesReducer,
        app: appReducer,
        lottery: lotteryReducer,
        auctions: auctionsReducer
    },
});

export default store; 


window.onhashchange = e => console.log(e);


window.onhashchange = e => {
    const splitted = e.newURL.split("#", 2);
    if(splitted.length === 2){
        store.dispatch(appNavigate(JSON.parse(window.atob(decodeURIComponent(splitted[1])))));
    }
}
