import Web3 from "web3";

import * as LandscapeContract from "../contracts_abi/LandscapeLottery.json";
import store from "../state/store";
import { finishInit } from "../state/slices/app.reducer";
import { setMyLandscapes, startMyLandscapesLoading, finishMyLandscapesLoading } from "../state/slices/myLandscapes.reducer";
import { addParticipation, delParticipation, lockLottery, unlockLottery } from "../state/slices/lottery.reducer";

const CONTRACT_ADDRESS = "0xc1506f861bc07B163791dAd2FaE290aaa96Ff93F";

class ContractAPI {
    init = async () => {
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(LandscapeContract.abi, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.send("eth_requestAccounts");
        this.account = accounts.result[0];
        this.initListeners();
        store.dispatch(finishInit());
        this.loadInitialData();
    };

    loadInitialData = async () => {
        store.dispatch(startMyLandscapesLoading());
        const myLandscapes = await this.loadMyLandscapes();
        store.dispatch(setMyLandscapes({ landscapes: myLandscapes }));
        store.dispatch(finishMyLandscapesLoading());

        if (await this.loadLotteryParticipation()) {
            store.dispatch(addParticipation());
        } else {
            store.dispatch(delParticipation());
        }
    };

    loadMyLandscapes = async () => {
        const myLandscapeIds = await this.contract.methods.getLandscapesByOwner(this.account).call();
        return await Promise.all(myLandscapeIds.map((landscapeId) => this.loadLandscape(landscapeId)));
    };

    loadLandscape = async (landscapeId) => {
        const data = await this.contract.methods.landscapes(landscapeId).call();
        return {
            id: landscapeId,
            name: data.name,
            dna: data.dna,
        };
    };

    initListeners = () => {
        this.contract.events
            .NewLandscape()
            .on("data", function (event) {
                // TODO check who is the owner, if I'm the owner add it to myLandscapes
                console.log("received data: ", event);
            })
            .on("error", console.error);

        this.contract.events.LandscapeLotteryFinished().on("data", (event) => {
            console.log("Landscape lottery finished", event);
            // TODO check if I am the winner
            store.dispatch(delParticipation());
        });
    };

    loadLotteryParticipation = async () => {
        return await this.contract.methods.isParticipating().call({ from: this.account });
    };

    resolveLottery = async () => {
        store.dispatch(lockLottery());
        try {
            await this.contract.methods.resolve().send({ from: this.account });
        } finally {
            store.dispatch(unlockLottery());
        }
    };

    participateLottery = async () => {
        store.dispatch(lockLottery());
        try {
            await this.contract.methods.participate().send({ from: this.account, value: this.web3.utils.toWei("0.0005", "ether") });
            store.dispatch(addParticipation());
        } finally {
            store.dispatch(unlockLottery());
        }
    };
}

export default new ContractAPI();
