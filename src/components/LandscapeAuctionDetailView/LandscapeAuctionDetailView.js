import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Badge, Button, Form, FormGroup, Icon, InputNumber, Loader, Tag, Timeline } from "rsuite";
import { useUiState } from "../../hooks/landscapes";
import contractService from "../../web3/contract.service";
import { auctionNotFinished } from "../../web3/notifications";
import AccountAddress from "../AccountAddress";
import Countdown from "../Countdown";
import "./LandscapeAuctionDetailView.css";
import StartAuctionModal from "./StartAuctionModal";

export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {
    //Calculate the next higher Bid
    const getNextBid = () => {
        const highestBid = Number(contractService.convertWeiToEth(auction.highestBid));
        return Number((highestBid + 0.001).toFixed(3));
    };
    // this is my address
    const myAddress = useSelector((state) => state.app.ethAddress);
    // this is the auction data
    const auction = landscape.auction;
    const auctionHighestBid = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBid);
    const auctionHighestBidder = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBidder);
    const auctionEndDate = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.endDate);

    const [formValueBid, setFormValueBid] = useState(getNextBid());
    const [showModal, setShowModal] = useState();
    const [bidError, setBidError] = useState(null);

    const [isAuctionStartInProgress] = useUiState(landscape.landscapeId, "processingAuctionStart");
    const [isAuctionEndInProgress] = useUiState(landscape.landscapeId, "processingAuctionEnd");
    const [isAuctionBidInProgress] = useUiState(landscape.landscapeId, "processingAuctionBid");


    const [isEndDateReached, setEndDateReached] = useState(false);

    // refresh isEndDateReached all 30s
    useEffect(() => {
        setEndDateReached(auctionEndDate < Math.ceil(Date.now() / 1000));
        const interval = setInterval(() => {
            setEndDateReached(auctionEndDate < Math.ceil(Date.now() / 1000));
        }, 1000*30)
        return () => clearInterval(interval)
    }, [auctionEndDate]);

    const formatSeconds = () => new Date(auction.endDate * 1000).toLocaleString();
    const displayEth = (amount) => Number(contractService.convertWeiToEth(amount)).toFixed(3) + " ETH";

    const didIParticipated = useMemo(() => {
        return auction.bids?.findIndex((b) => b.bidder === myAddress) >= 0
    }, [auction.bids, myAddress]);

    //Check if deisred value is bigger than highest bid.
    const setBid = () => {
        if (formValueBid <= contractService.convertWeiToEth(auctionHighestBid)) {
            const highestBidEth = contractService.convertWeiToEth(auctionHighestBid);
            setBidError(`Your bid is to small. Highest Bid is currently ${highestBidEth}`);
            console.log("new amount", getNextBid());
            setFormValueBid(getNextBid());
        } else {
            setBidError(null);
            try {
                contractService.bid(landscape.landscapeId, formValueBid);
            } catch(e){
                Alert.error('Bid transaction failed. Please try again.');
            }
        }
    };

    const submitEndOfAuction = () => {
        if (isEndDateReached) {
            try {
                contractService.endAuction(landscape.landscapeId);
            } catch(e){
                Alert.error('Ending auction failed. Please try again.');
            }
        } else {
            auctionNotFinished(auctionEndDate);
        }
    };

    let startForm;
    if (isUserOwner && !auction.running) {
        startForm = (
            <>
                <p style={{ maxWidth: "800px" }}>
                    You can sell your CryptLandscape by starting an auction. Everyone can bid for you CryptoLandscape until a fixed date. Afterwards,
                    you (or the highest bidder) can complete the auction by transfering the CryptoLandscape and the coins.
                </p>
                <br />
                {!isAuctionStartInProgress && (
                    <Button appearance="ghost" disabled={auction.running || isAuctionStartInProgress} onClick={() => setShowModal(true)}>
                        Start Auction
                    </Button>
                )}
                {isAuctionStartInProgress && (
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                        <Loader />
                        &nbsp;<span>Auction is being started...</span>
                    </div>
                )}
                <br />
            </>
        );
    }

    let biddingForm;
    if (auction.running && !isEndDateReached) {
        biddingForm = (
            <>
                <br />
                <Form layout="inline">
                    <FormGroup>
                        <InputNumber
                            disabled={isAuctionBidInProgress}
                            value={formValueBid}
                            step={0.001}
                            onChange={setFormValueBid}
                            min={getNextBid()}
                        />
                        {bidError && <Tag color="red">{bidError}</Tag>}
                    </FormGroup>
                    <FormGroup>
                        <Button appearance="ghost" disabled={isAuctionBidInProgress} loading={isAuctionBidInProgress} onClick={setBid}>
                            Bid
                        </Button>
                    </FormGroup>
                </Form>
            </>
        );
    }

    let endAuctionButton;
    if (auction.running && (isUserOwner || myAddress === auctionHighestBidder)) {
        endAuctionButton = (
            <Badge content={isEndDateReached}>
                <Button
                    appearance="ghost"
                    disabled={!isEndDateReached || isAuctionEndInProgress}
                    loading={isAuctionEndInProgress}
                    onClick={submitEndOfAuction}
                >
                    End Auction
                </Button>
            </Badge>
        );
    }

    return (
        <div>
            <h4>Auction</h4>
            {!auction.running && !isUserOwner && (
                <p>
                    <Icon icon="info" />
                    &nbsp;There is no ongoing auction for this beauty
                </p>
            )}
            {startForm}
            {auction.running && (
                <table className="auction-info-table">
                    <tbody>
                        <tr>
                            <td>
                                <Icon icon="clock-o" /> End date
                            </td>
                            <td>
                                <Countdown
                                    pointInTimeSeconds={auction.endDate}
                                    ifFinished={`Auction closed (Ended at ${formatSeconds(auction.EndDate)})`}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Icon icon="tag" /> Highest bid
                            </td>
                            <td>
                                {displayEth(auction.highestBid)}
                                &nbsp;&nbsp;
                                {auction.highestBidder === myAddress && <Tag color="green">It's you!</Tag>}
                                {auction.highestBidder !== myAddress && didIParticipated && <Tag color="red">You have been outbid!</Tag>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            {biddingForm}
            {endAuctionButton}
            {auction.running && (
                <div>
                    <br />
                    <h5>Bids</h5>
                    <Timeline>
                        {(auction.bids || []).map((b) => (
                            <Timeline.Item key={b.time}>
                                <i>{formatSeconds(b.time)}</i>: <strong>{displayEth(b.amount)}</strong> by <AccountAddress address={b.bidder} />
                            </Timeline.Item>
                        ))}
                    </Timeline>
                    {(auction.bids || []).length === 0 && <p>No bids yet</p>}
                </div>
            )}
            <StartAuctionModal setShowModal={setShowModal} showModal={showModal} landscape={landscape} />
        </div>
    );
}
