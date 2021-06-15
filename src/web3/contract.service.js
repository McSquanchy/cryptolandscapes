import Web3 from "web3";
import { Alert } from "rsuite";
import * as LandscapeContract from "../contracts_abi/FetchableLandscape.json";
import store from "../state/store";
import { finishInit, setAppError, setMyETHAddress, setOwner, setWithDrawableEth, setIsWithdrawing} from "../state/slices/app.reducer";
import {
    addParticipation,
    delParticipation,
    lockAdminLottery,
    unlockAdminLottery,
    lockLottery,
    unlockLottery,
    setMyShares,
    setTotalShares,
    setParticipants,
    addLatestParticipant,
    setAvailableWinWithdrawals,
    setShowWithdrawModal,
    lockWithdraw,
    unlockWithdraw,
} from "../state/slices/lottery.reducer";
import {
    finishLandscapesLoading,
    setLandscapes,
    setLandscapeUiState,
    startLandscapesLoading,
    updateLandscape,
    setBidHistory,
    setOwnerHistory,
    addAuctionBid,
} from "../state/slices/landscapes.reducer";
import { auctionCreated, didNotWinLottery, outbidModal, receivedLandscape } from "./notifications";

const CONTRACT_ADDRESS = "0x90926E45c3f2de3B0C617F0ec86679D81E5D19af";

class ContractService {
    init = async () => {
        if (this.initialized) return;
        if (!window.ethereum) {
            store.dispatch(setAppError("No accessible Etherum wallet found.<br> Install MetaMask https://metamask.io/"));
            return;
        }
        this.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        this.contract = new this.web3.eth.Contract(LandscapeContract.abi, CONTRACT_ADDRESS);
        const accounts = await this.web3.eth.requestAccounts();
        this.refreshAccount(accounts);
        window.ethereum.on("accountsChanged", this.refreshAccount);

        this.initListeners();

        store.dispatch(finishInit());
        this.initialized = true;
    };

    refreshAccount = async (accounts) => {
        this.account = accounts[0];
        console.log("myAccount", this.account);
        const owner = await this.contract.methods.owner().call();
        console.log("ownerAccount", owner);
        if (owner.toLowerCase() === this.account.toLowerCase()) {
            store.dispatch(setOwner(true));
            const participants = await this.loadParticipants();
            store.dispatch(setParticipants(participants));
        } else {
            store.dispatch(setOwner(false));
        }
        this.loadInitialData();
    };

    convertWeiToEth = (amount) => {
        return Web3.utils.fromWei(amount.toString(), "ether");
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
        const withDrawTokens = await this.loadAvailableNftWithdrawals();
        store.dispatch(setAvailableWinWithdrawals(withDrawTokens));
        const withdrawBalance = await this.loadWithdrawableEth();
        store.dispatch(setWithDrawableEth(Web3.utils.fromWei(withdrawBalance)));
        if (await this.loadLotteryParticipation()) {
            const totalShares = await this.loadTotalShares();
            const myShares = await this.loadMyShares();
            store.dispatch(setMyShares(myShares));
            store.dispatch(setTotalShares(totalShares));
            store.dispatch(addParticipation());
        } else {
            store.dispatch(delParticipation());
        }
    };

    getMyAddress() {
        return this.account;
    }

    loadWithdrawableEth = async() => {
        return this.contract.methods.getMyBalance().call({from: this.account});
    }

    loadWithdrawableEth = async() => {
        return this.contract.methods.getMyBalance().call({from: this.account});
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
                auctionId: Number(landscape.auction.auctionId),
                highestBid: landscape.auction.highestBid,
                highestBidder: landscape.auction.highestBidder,
                endDate: Number(landscape.auction.endDate),
                running: landscape.auction.running,
                bids: [],
            },

            ownerHistory: [],
        };
    };

    triggerDetailLoad = async (landscapeId, auctionId) => {
        store.dispatch(setBidHistory({ landscapeId, bids: await this.loadBidHistory(auctionId) }));
        store.dispatch(setOwnerHistory({ landscapeId, ownerHistory: await this.loadOwnerHistory(landscapeId) }));
    };

    loadBidHistory = async (auctionId) => {
        const data = await this.contract.getPastEvents("BidCreated", { fromBlock: 0, toBlock: "latest", filter: { auctionId: auctionId + "" } });
        return (data || [])
            .map(({ returnValues: { auctionId, landscapeId, bidder, amount, time } }) => ({
                auctionId,
                landscapeId,
                bidder,
                amount: Number(amount),
                time: Number(time),
            }))
            .reverse();
    };

    loadOwnerHistory = async (landscapeId) => {
        const data = await this.contract.getPastEvents("LandscapeTransferred", {
            fromBlock: 0,
            toBlock: "latest",
            filter: { landscapeId: landscapeId + "" },
        });
        return (data || [])
            .map(({ returnValues: { landscapeId, newOwner, oldOwner, time } }) => {
                return {
                    landscapeId,
                    newOwner,
                    oldOwner,
                    time: Number(time),
                };
            })
            .reverse();
    };

    initListeners = () => {
        console.log("registered listeners");
        this.contract.events
            .NewLandscape()
            .on(
                "data",
                debouncer(async ({ landscapeId, owner }) => {
                    const landscape = await this.loadLandscape(landscapeId);
                    store.dispatch(updateLandscape(landscape));
                    if (landscape.owner === this.account) {
                        receivedLandscape(landscape);
                    }
                })
            )
            .on("error", console.error);

        this.contract.events
            .LandscapeLotteryFinished()
            .on(
                "data",
                debouncer(async ({ winner, resolver }) => {
                    console.log("LandscapeLotteryFinished. Winner was: ", winner);
                    store.dispatch(setTotalShares(0));
                    store.dispatch(setMyShares(0));
                    store.dispatch(setParticipants([]));
                    store.dispatch(delParticipation());
                    if (winner.toLowerCase() === this.account.toLowerCase()) {
                        const withDrawTokens = await this.loadAvailableNftWithdrawals();
                        store.dispatch(setAvailableWinWithdrawals(withDrawTokens));
                        store.dispatch(setShowWithdrawModal(true));
                    } else {
                        didNotWinLottery();
                    }
                })
            )
            .on("changed", (e) => {
                console.log(e);
            })
            .on("error", console.error);

        this.contract.events
            .PendingWithdrawalChanged()
            .on("data", debouncer(async ({addr}) => {
                if(this.account === addr){
                    const withdrawBalance = await this.loadWithdrawableEth();
                    store.dispatch(setWithDrawableEth(Web3.utils.fromWei(withdrawBalance)));
                }
            }))
            .on("error", console.error);

        this.contract.events
            .AuctionCreated()
            .on(
                "data",
                debouncer(async ({ landscapeId }) => {
                    const landscape = await this.loadLandscape(landscapeId)
                    store.dispatch(updateLandscape(landscape));
                    if(this.account !== landscape.owner){
                        auctionCreated(landscape);
                    }
                })
            )
            .on("error", console.error);

        this.contract.events
            .BidCreated()
            .on(
                "data",
                debouncer(async ({ auctionId, landscapeId, bidder, amount, time }) => {
                    const landscape = store.getState().landscapes.landscapes[Number(landscapeId)];
                    if(landscape.auction.bids.length > 0){
                        const prevBid = landscape.auction.bids[0];
                        if(prevBid.bidder === this.account){
                            outbidModal(landscape)
                        }
                    }
                    store.dispatch(updateLandscape({
                        ...landscape,
                        auction: {
                            ...landscape.auction,
                            highestBid: amount,
                            highestBidder: bidder
                        }
                    }));
                    store.dispatch(addAuctionBid({ auctionId, landscapeId, bidder, amount, time }));
                    const withdrawBalance = await this.loadWithdrawableEth();
                    store.dispatch(setWithDrawableEth(Web3.utils.fromWei(withdrawBalance)));
                })
            )
            .on("error", console.error);

        this.contract.events
            .AuctionFinished()
            .on(
                "data",
                debouncer(async ({ landscapeId }) => {
                    store.dispatch(updateLandscape(await this.loadLandscape(landscapeId)));
                    console.log("AuctionFinished ", landscapeId);
                })
            )
            .on("error", console.error);

        this.contract.events
            .LandscapeNameChanged()
            .on(
                "data",
                debouncer(({ landscapeId, newName }) => {
                    const landscape = store.getState().landscapes.landscapes[Number(landscapeId)];
                    store.dispatch(updateLandscape({ ...landscape, name: newName }));
                })
            )
            .on("error", console.error);

        this.contract.events
            .LandscapeTransferred()
            .on(
                "data",
                debouncer(({ landscapeId, newOwner }) => {
                    const landscape = store.getState().landscapes.landscapes[Number(landscapeId)];
                    store.dispatch(updateLandscape({ ...landscape, owner: newOwner }));
                    if (newOwner === this.account) {
                        receivedLandscape(landscape);
                    }
                })
            )
            .on("error", console.error);

        this.contract.events
            .LandscapeLotterySharesPurchased()
            .on(
                "data",
                debouncer(({ nrOfParticipants }) => {
                    store.dispatch(setTotalShares(nrOfParticipants));
                })
            )
            .on("error", console.error);

        this.contract.events
            .LandscapeLotteryNewParticipant()
            .on(
                "data",
                debouncer(() => {
                    this.loadLatestParticipant().then((participant) => store.dispatch(addLatestParticipant(participant)));
                })
            )
            .on("error", console.error);
    };

    loadAvailableNftWithdrawals = async () => {
        return await this.contract.methods.getAvailableWithdrawals().call({ from: this.account });
    };

    loadLatestParticipant = async () => {
        return await this.contract.methods.getLatestParticipant().call({ from: this.account });
    };

    loadParticipants = async () => {
        return await this.contract.methods.getParticipants().call({ from: this.account });
    };

    loadMyShares = async () => {
        return await this.contract.methods.getMyShares().call({ from: this.account });
    };

    loadTotalShares = async () => {
        return await this.contract.methods.getTotalAmountOfShares().call({ from: this.account });
    };

    loadLotteryParticipation = async () => {
        return await this.contract.methods.isParticipating().call({ from: this.account });
    };

    resolveLottery = async () => {
        store.dispatch(lockAdminLottery());
        try {
            await this.contract.methods.resolve().send({ from: this.account });
        } finally {
            store.dispatch(unlockAdminLottery());
        }
    };

    collectNFT = async (nftName) => {
        return await this.contract.methods.withDrawLandscape(nftName).send({ from: this.account });
    };

    withdraw = async () => {
        store.dispatch(setIsWithdrawing(true));
        await this.contract.methods.withdraw().send({ from: this.account });
        store.dispatch(setIsWithdrawing(false));
        const withdrawBalance = await this.loadWithdrawableEth();
        store.dispatch(setWithDrawableEth(Web3.utils.fromWei(withdrawBalance)));
    };

    participateLottery = async (sharesToBuy) => {
        store.dispatch(lockLottery());
        try {
            const amount = (sharesToBuy * 0.0005).toFixed(4);
            await this.contract.methods.participate(sharesToBuy).send({ from: this.account, value: this.web3.utils.toWei(String(amount), "ether") });
            store.dispatch(addParticipation());
            const myShares = await this.loadMyShares();
            store.dispatch(setMyShares(myShares));
        } finally {
            store.dispatch(unlockLottery());
        }
    };

    bid = async (landscapeId, amount) => {
        controlUiState(landscapeId, "processingAuctionBid", async () => {
            try {
                await this.contract.methods.bid(landscapeId + "").send({ from: this.account, value: this.web3.utils.toWei(amount + "", "ether") });
            } catch(e) {
                Alert.error({
                        content: 'You were outbid by another user!',
                        duration: 2000
                    })
            }
        });
    };

    endAuction = async (landscapeId) => {
        controlUiState(landscapeId, "processingAuctionEnd", async () => {
            await this.contract.methods.endAuction(landscapeId + "").send({ from: this.account });
        });
    };

    startAuction = async (landscapeId, endDate, minPrice) => {
        controlUiState(landscapeId, "processingAuctionStart", async () => {
            await this.contract.methods
                .startAuction(landscapeId + "", endDate + "", this.web3.utils.toWei(minPrice, "ether"))
                .send({ from: this.account });
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

    collectWin = async (nftName) => {
        store.dispatch(lockWithdraw());
        await this.collectNFT(nftName);
        const withDrawTokens = await this.loadAvailableNftWithdrawals();
        store.dispatch(setAvailableWinWithdrawals(withDrawTokens));
        store.dispatch(unlockWithdraw());
    };
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

const debouncer = (eventHandleFn) => {
    const txMap = {};
    return (e) => {
        clearTimeout(txMap[e.transactionHash + e.transactionLogIndex]);
        txMap[e.transactionHash + e.transactionLogIndex] = setTimeout(() => {
            eventHandleFn(e.returnValues);
            delete txMap[e.transactionHash + e.transactionLogIndex];
        }, 200);
    };
};

export default new ContractService();
