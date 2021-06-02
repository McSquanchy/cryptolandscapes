import Web3 from "web3";

import * as LandscapeContract from "../contracts_abi/FetchableLandscape.json";
import store from "../state/store";
import { finishInit, setMyETHAddress } from "../state/slices/app.reducer";
import { addParticipation, delParticipation, lockLottery, unlockLottery } from "../state/slices/lottery.reducer";
import {
    finishLandscapesLoading,
    setLandscapes,
    setLandscapeUiState,
    startLandscapesLoading,
    updateLandscape,
} from "../state/slices/landscapes.reducer";

const CONTRACT_ADDRESS = "0x72b0C4B1dc4a7Fb65527C9b9398C4aC706FA987E";

class ContractService {
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

    isValidAddress(addr) {
        return this.web3.utils.isAddress(addr);
    }

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
        return ((await this.contract.methods.getLandscapes().call()) || []).map(this.transformLandscape);
    };

    loadLandscape = async (landscapeId) => {
        return this.transformLandscape(await this.contract.methods.getLandscape(landscapeId).call(), landscapeId);
    };

    transformLandscape = (landscape, index) => {
        return {
            name: landscape.name,
            landscapeId: index,
            dna: landscape.dna,
            owner: landscape.owner,
            auction: {
                minPrice: Number(landscape.auction.minPrice),
                endDate: Number(landscape.auction.endDate),
                running: landscape.auction.running,
                bids: landscape.auction.bids.map((bid) => ({ bidder: bid.bidder, amount: bid.amount, date: Number(bid.date) })),
            },
        };
    };

    initListeners = () => {
        console.log("listeners registered");
        this.contract.events
            .NewLandscape()
            .on("data", async ({ returnValues: { landscapeId, owner } }) => {
                // TODO special handling if my landscape
                const landscape = await this.loadLandscape(landscapeId);
                store.dispatch(updateLandscape(landscape));
            })
            .on("error", console.error);

        this.contract.events
            .LandscapeLotteryFinished()
            .on("data", (event) => {
                console.log("LandscapeLotteryFinished", event);
                // TODO check if I am the winner
                store.dispatch(delParticipation());
            })
            .on("error", console.error);
        this.contract.events
            .PendingWithdrawalChanged()
            .on("data", (e) => {
                console.log("PendingWithdrawalChanged ", e);
            })
            .on("error", console.error);
        this.contract.events
            .AuctionCreated()
            .on("data", (e) => {
                console.log("AuctionCreated ", e);
            })
            .on("error", console.error);
        this.contract.events
            .BidCreated()
            .on("data", (e) => {
                console.log("BidCreated ", e);
            })
            .on("error", console.error);
        this.contract.events
            .AuctionFinished()
            .on("data", (e) => {
                console.log("AuctionFinished ", e);
            })
            .on("error", console.error);

        this.contract.events
            .LandscapeNameChanged()
            .on("data", ({ returnValues: { landscapeId, newName } }) => {
                const landscape = store.getState().landscapes.landscapes[Number(landscapeId)];
                store.dispatch(updateLandscape({ ...landscape, name: newName }));
            })
            .on("error", console.error);

        this.contract.events
            .LandscapeTransferred()
            .on("data", ({ returnValues: { landscapeId, newOwner } }) => {
                const landscape = store.getState().landscapes.landscapes[Number(landscapeId)];
                store.dispatch(updateLandscape({ ...landscape, owner: newOwner }));
            })
            .on("error", console.error);
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
        controlUiState(landscapeId, "processingAuctionBid", async () => {
            await this.contract.methods.bid(landscapeId).send({ from: this.account, value: this.web3.utils.toWei(amount + "", "ether") });
        });
    };

    endAuction = async (landscapeId) => {
        controlUiState(landscapeId, "processingAuctionEnd", async () => {
            await this.contract.methods.endAuction(landscapeId).send({ from: this.account });
        });
    };

    startAuction = async (landscapeId, endDate, minPrice) => {
        controlUiState(landscapeId, "processingAuctionStart", async () => {
            await this.contract.methods.startAuction(landscapeId, endDate, minPrice).send({ from: this.account });
        });
    };

    changeName = async (landscapeId, newName) => {
        if (newName == null) return;

        controlUiState(landscapeId, "processingNameChange", async () => {
            await this.contract.methods
                .changeName(landscapeId, newName)
                .send({ from: this.account, value: this.web3.utils.toWei("0.0005", "ether") });
        });
    };

    transferOwnership = async (landscapeId, newOwnerAddress) => {
        controlUiState(landscapeId, "processingOwnershipTransfer", async () => {
            await this.contract.methods.transferLandscape(landscapeId, newOwnerAddress).send({ from: this.account });
        });
    };

    loadOwnerHistory = async (landscapeId) => {
        const data = await this.contract.getPastEvents("LandscapeTransferred", { fromBlock: 0, toBlock: "latest", filter: {landscapeId: landscapeId + ""} });
        return (data || []).map(({returnValues: {landscapeId, newOwner, oldOwner, time}}) => {
            return {
                landscapeId,
                newOwner, 
                oldOwner,
                time: Number(time)
            };
        }).reverse()
    }
}

const controlUiState = async (landscapeId, topic, work) => {
    store.dispatch(setLandscapeUiState({ landscapeId, topic: topic, value: true }));
    try {
        await work();
    } catch (e) {
        throw e;
    } finally {
        store.dispatch(setLandscapeUiState({ landscapeId, topic: topic, value: false }));
    }
};

export default new ContractService();
