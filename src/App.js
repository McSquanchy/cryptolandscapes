import "./App.css";

import { useSelector } from "react-redux";
import ContractAPI from "./web3/contract.service";
import MyLandscapesList from "./MyLandscapesList";
import LotteryView from "./LotteryView";

ContractAPI.init();

function App() {
    const isLoading = useSelector((state) => !state.app.initialized);
    if (isLoading) {
        return <div>Loading... (Allow MetaMask)</div>;
    } else {
        return (
            <div>
                <h1>Hello World</h1>
                <MyLandscapesList />
                <LotteryView />
            </div>
        );
    }
}

export default App;
