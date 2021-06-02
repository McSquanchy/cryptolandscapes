import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import AllAuctionsPage from "./components/AllAuctionsPage";
import AllLandscapesPage from "./components/AllLandscapesPage";
import LandscapeDetailPage from "./components/LandscapeDetailPage";
import LotteryView from "./components/LotteryView/LotteryView";
import MyAuctionsPage from "./components/MyAuctionsPage";
import MyLandscapesPage from "./components/MyLandscapesPage";
import NotFoundPage from "./components/NotFoundPage";
import NavigationBar from "./components/NavigationBar";
import { appNavigate } from "./state/slices/app.reducer";
import ContractAPI from "./web3/contract.service";

ContractAPI.init();

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
        default:
            return <NotFoundPage />;
    }
};

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => !state.app.initialized);
    const navState = useSelector((state) => state.app.navState);
    const navigateTo = (navState) => {
        dispatch(appNavigate(navState));
    };

    if (isLoading) {
        return <div>Loading... (Allow MetaMask)</div>;
    } else {
        return (
            <>
                <NavigationBar navigate={navigateTo} />
                <div className="content-wrapper">
                    <div className="main-content">{showCurrentPage(navState)}</div>
                    <div className="sidebar">
                        <LotteryView />
                    </div>
                </div>
            </>
        );
    }
}

export default App;
