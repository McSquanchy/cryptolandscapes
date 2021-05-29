import Web3 from "web3";

import * as LandscapeContract from "../contracts_abi/LandscapeHelper.json";
import store from "../state/store";
import { finishInit } from "../state/slices/app.reducer";
import { setMyLandscape, setMyLandscapes, startMyLandscapesLoading, finishMyLandscapesLoading } from "../state/slices/myLandscapes.reducer";
import { addParticipation, delParticipation, lockLottery, unlockLottery } from "../state/slices/lottery.reducer";
import { setAuctions } from "../state/slices/auctions.reducer";

const CONTRACT_ADDRESS = "0xAD2b9a5675c6e6d21F78D56d27A334B5Ed1d366a";

class ContractAPI {
    init = async () => {
        if(this.initialized) return;
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(LandscapeContract.abi, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.send("eth_requestAccounts");
        this.account = accounts.result[0];
        this.initListeners();
        store.dispatch(finishInit());
        this.loadInitialData();
        this.initialized = true;
    };

    loadInitialData = async () => {
        store.dispatch(startMyLandscapesLoading());
        const myLandscapes = await this.loadMyLandscapes();
        store.dispatch(setMyLandscapes({ landscapes: myLandscapes }));
        store.dispatch(finishMyLandscapesLoading());

        store.dispatch(setAuctions({auctions: await this.loadAuctions()}));

        if (await this.loadLotteryParticipation()) {
            store.dispatch(addParticipation());
        } else {
            store.dispatch(delParticipation());
        }
    };

    loadMyLandscapes = async () => {
        const myLandscapeIds = (await this.contract.methods.getLandscapesByOwner(this.account).call()) || [];
        return await Promise.all(myLandscapeIds.map((landscapeId) => this.loadLandscape(landscapeId)));
    };
    
    loadAuctions = async () => {
        const auctionIds = await this.contract.methods.getActiveAuctions().call();
        console.log('auctions', auctionIds);

        return Promise.all(auctionIds.map(async landscapeId => {
            landscapeId = Number(landscapeId);
            const auction = await this.contract.methods.auctions(landscapeId).call();
            return {
                ...(await this.loadLandscape(landscapeId)),
                minPrice: auction.minPrice,
                endDate: auction.endDate
            };
        }))
    }

    loadLandscape = async (landscapeId) => {
        const data = await this.contract.methods.landscapes(landscapeId).call();
        return {
            id: landscapeId,
            name: data.name,
            dna: data.dna,
        };
    };

    initListeners = () => {
        console.log('listeners registered');
        this.contract.events
            .NewLandscape()
            .on("data", function (event) {
                // TODO check who is the owner, if I'm the owner add it to myLandscapes
                console.log("NewLandscape", event);
            })
            .on("error", console.error);

        this.contract.events.LandscapeLotteryFinished().on("data", (event) => {
            console.log("LandscapeLotteryFinished", event);
            // TODO check if I am the winner
            store.dispatch(delParticipation());
        });
        this.contract.events.PendingWithdrawalChanged().on("data", (e) => {
            console.log("PendingWithdrawalChanged ", e);
        });
        this.contract.events.BidCreated().on("data", (e) => {
            console.log("BidCreated ", e);
        });
        this.contract.events.AuctionCreated().on("data", (e) => {
            console.log("AuctionCreated ", e);
        });
        this.contract.events.AuctionFinished().on("data", (e) => {
            console.log("AuctionFinished ", e);
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

    withdraw = async () => {
        await this.contract.methods.withdraw().send({ from: this.account });
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

    bid = async(landscapeId, amount) => {
        await this.contract.methods.bid(landscapeId).send({ from: this.account, value: this.web3.utils.toWei(amount+"", "ether") });
    }

    endAuction = async (landscapeId) => {
        await this.contract.methods.endAuction(landscapeId).send({ from: this.account });
    }

    startAuction = async (landscapeId, endDate, minPrice) => {
        console.log('transaction end in ', (new Date(endDate * 1000)));
        await this.contract.methods.startAuction(landscapeId, endDate, minPrice).send({ from: this.account });
    }

    changeName = async (landscapeId, newName) => {
        console.log("changing name to", newName);
        await this.contract.methods.changeName(landscapeId, newName).send({from: this.account, value: this.web3.utils.toWei("0.0005", "ether")});
        console.log("updating");
        // store.dispatch(startMyLandscapesLoading());
        const newLandscape = await this.loadLandscape(landscapeId);
        store.dispatch(setMyLandscape({landscape: newLandscape}));
        // store.dispatch(finishMyLandscapesLoading());
    }
}

export default new ContractAPI();
