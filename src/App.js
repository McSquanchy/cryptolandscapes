import { useSelector } from "react-redux";
import "./App.css";
import AccountDetailPage from "./components/AccountDetailPage";
import AllAuctionsPage from "./components/AllAuctionsPage";
import AllLandscapesPage from "./components/AllLandscapesPage";
import LandscapeDetailPage from "./components/LandscapeDetailPage";
import LotteryView from "./components/LotteryView/LotteryView";
import MyAuctionsPage from "./components/MyAuctionsPage";
import MyLandscapesPage from "./components/MyLandscapesPage";
import NavigationBar from "./components/NavigationBar";
import NotFoundPage from "./components/NotFoundPage";
import { navTo } from "./nav";
import ContractService from "./web3/contract.service";

ContractService.init();

const showCurrentPage = (navState) => {
    switch (navState.keyword) {
        case "my-auctions":
            return <MyAuctionsPage />;
        case "all-auctions":
            return <AllAuctionsPage />;
        case "my-landscapes":
            return <MyLandscapesPage />;
        case "all-landscapes":
            return <AllLandscapesPage />;
        case "landscape-detail":
            return <LandscapeDetailPage landscapeId={navState.landscapeId} />;
        case "account-detail":
            return <AccountDetailPage address={navState.address} />
        default:
            return <NotFoundPage />;
    }
};

function App() {
    const isLoading = useSelector((state) => !state.app.initialized);
    const navState = useSelector((state) => state.app.navState);
    const navigateTo = (navState) => {
        navTo(navState)
    };

    if (isLoading) {
        return <div>Loading... (Allow MetaMask)</div>;
    } else {
        return (
            <>
                <NavigationBar navigate={navigateTo} />
                <div className="content-wrapper">
                    <div className="sidebar">
                        <LotteryView />
                    </div>
                    <div className="main-content">{showCurrentPage(navState)}</div>
                </div>
            </>
        );
    }
}

export default App;
