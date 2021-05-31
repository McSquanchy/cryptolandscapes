import "./App.css";

import { useSelector } from "react-redux";
import ContractAPI from "./web3/contract.service";
import MyLandscapesList from "./MyLandscapesList";
import LotteryView from "./LotteryView";
import AuctionList from "./AuctionList";
import NavigationBar from "./NavigationBar";
import { useState } from "react";

ContractAPI.init();

const showCurrentPage = (keyword) => {
    switch (keyword) {
        case "my-auctions":
            return <AuctionList />;
        case "all-auctions":
            return <AuctionList />;
        case "lottery":
            return <LotteryView />;
        default:
            return <MyLandscapesList />;
    }
};

function App() {
    const isLoading = useSelector((state) => !state.app.initialized);
    const [currentPage, setCurrentPage] = useState("home");

    if (isLoading) {
        return <div>Loading... (Allow MetaMask)</div>;
    } else {
        return (
            <div>
                <NavigationBar navigate={setCurrentPage} />
                {showCurrentPage(currentPage)}
            </div>
        );
    }
}

export default App;
