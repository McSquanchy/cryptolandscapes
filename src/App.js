import { useSelector } from "react-redux";
import "./App.css";
import AccountDetailPage from "./components/AccountDetailPage";
import AllAuctionsPage from "./components/AllAuctionsPage";
import AllLandscapesPage from "./components/AllLandscapesPage";
import LandscapeDetailPage from "./components/LandscapeDetailPage";
import LotteryView from "./components/LotteryView/LotteryView";
import WithdrawalView from "./components/WithdrawalView/WithdrawalView";
import MyAuctionsPage from "./components/MyAuctionsPage";
import MyLandscapesPage from "./components/MyLandscapesPage";
import NavigationBar from "./components/NavigationBar";
import NotFoundPage from "./components/NotFoundPage";
import { navTo } from "./nav";
import ContractService from "./web3/contract.service";
import { Divider, Loader, Message } from "rsuite";

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
            return <AccountDetailPage address={navState.address} />;
        default:
            return <NotFoundPage />;
    }
};

function App() {
    const isLoading = useSelector((state) => !state.app.initialized);
    const error = useSelector((state) => state.app.error);
    const navState = useSelector((state) => state.app.navState);
    const navigateTo = (navState) => {
        navTo(navState);
    };
    if (error) {
        return (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                <Message showIcon type="error" title="Error" description={error} />
            </div>
        );
    } else if (isLoading) {
        return <Loader size="lg" center content={<span>Please allow access to MetaMask</span>} />;
    } else {
        return (
            <>
                <div className="content-wrapper">
                    <div className="sidebar">
                        <h1
                            style={{ cursor: "pointer", fontSize: "2em" }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigateTo({ keyword: "my-landscapes" });
                            }}
                        >
                            CryptoLandscapes
                        </h1>
                        <Divider />
                        <LotteryView />
                        <Divider />
                        <WithdrawalView />
                    </div>
                    <div className="main-content">
                        <NavigationBar navigate={navigateTo} />
                        <div className="current-page">{showCurrentPage(navState)}</div>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
