import { Notification } from "rsuite";

export function noParticipants() {
    Notification["error"]({
    title: "Cannot resolve the lottery",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >No participants!</p>
    });
}

export function didNotWinLottery() {
    Notification["info"]({
    title: "Lottery has concluded",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >Unfortunately, you did not win!</p>
    }); 
}

export function valueToSmall(auctionHighestBid) {
    Notification["error"]({
    title: "Value must be greater than highest bid",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >Value to small. Highest Bid was {auctionHighestBid}</p>
    });
}

export function auctionNotFinished(expiringDate) {
    Notification["error"]({
    title: "Please wait until Auction finished",
    duration: 2000,
    description: <p style={{ width: 320 }} rows={3} >Auction ends at {new Date(expiringDate * 1000).toLocaleString()}</p>
    });
}
