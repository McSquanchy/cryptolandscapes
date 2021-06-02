import Web3 from "web3";

import * as LandscapeContract from "../contracts_abi/LandscapeHelper.json";
import store from "../state/store";
import { finishInit, setMyETHAddress } from "../state/slices/app.reducer";
import { addParticipation, delParticipation, lockLottery, unlockLottery } from "../state/slices/lottery.reducer";
import { finishLandscapesLoading, setLandscapes, startLandscapesLoading, updateLandscape } from "../state/slices/landscapes.reducer";

const CONTRACT_ADDRESS = "0x3110622b4246232E9Cc374Da80e682f7599Ac2a3";

class ContractAPI {
    init = async () => {
        if (this.initialized) return;
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(LandscapeContract.abi, CONTRACT_ADDRESS);
        const accounts = await window.ethereum.send("eth_requestAccounts");
        this.account = accounts.result[0];
        console.log("myAccount", this.account);
        this.initListeners();
        store.dispatch(finishInit());
        this.loadInitialData();
        this.initialized = true;
    };

    loadInitialData = async () => {
        store.dispatch(setMyETHAddress(this.account));
        store.dispatch(startLandscapesLoading());
        const landscapes = await this.loadAllLandscapes();
        store.dispatch(setLandscapes(landscapes));
        store.dispatch(finishLandscapesLoading());

        if (await this.loadLotteryParticipation()) {
            store.dispatch(addParticipation());
        } else {
            store.dispatch(delParticipation());
        }
    };

    getMyAddress() {
        return this.account;
    }

    loadAllLandscapes = async () => {
        return ((await this.contract.methods.getLandscapes().call()) || []).map((landscape, index) => {
            return {
                name: landscape.name,
                landscapeId: index,
                dna: landscape.dna,
                owner: landscape.owner,
                auction: {
                    minPrice: Number(landscape.auction.minPrice),
                    endDate: Number(landscape.auction.endDate),
                    running: landscape.auction.running,
                    bids: landscape.auction.bids.map(bid => ({bidder: bid.bidder, amount: bid.amount, date: Number(bid.date)}))
                }
            }
        });
    };

    loadAuctions = async () => {
        const auctionIds = await this.contract.methods.getActiveAuctions().call();
        console.log("auctions", auctionIds);

        return Promise.all(
            auctionIds.map(async (landscapeId) => {
                landscapeId = Number(landscapeId);
                const auction = await this.contract.methods.auctions(landscapeId).call();
                return {
                    ...(await this.loadLandscape(landscapeId)),
                    minPrice: auction.minPrice,
                    endDate: auction.endDate,
                };
            })
        );
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
        console.log("listeners registered");
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
        // change some state in redux
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

    bid = async (landscapeId, amount) => {
        await this.contract.methods.bid(landscapeId).send({ from: this.account, value: this.web3.utils.toWei(amount + "", "ether") });
    };

    endAuction = async (landscapeId) => {
        await this.contract.methods.endAuction(landscapeId).send({ from: this.account });
    };

    startAuction = async (landscapeId, endDate, minPrice) => {
        console.log("transaction end in ", new Date(endDate * 1000));
        await this.contract.methods.startAuction(landscapeId, endDate, minPrice).send({ from: this.account });
    };

    changeName = async (landscapeId, newName) => {
        console.log("changing name to", newName);
        await this.contract.methods.changeName(landscapeId, newName).send({ from: this.account, value: this.web3.utils.toWei("0.0005", "ether") });
        console.log("updating");
        const newLandscape = await this.loadLandscape(landscapeId);
        store.dispatch(updateLandscape({ landscape: newLandscape }));
    };
}

export default new ContractAPI();
