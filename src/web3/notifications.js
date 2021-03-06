import { Alert, Notification } from "rsuite";
import LandscapeLink from "../components/LandscapeLink";
import NFT from "../components/NFT/NFT";

export function noParticipants() {
    Alert.error('No participants yet', 2000)
}

export function didNotWinLottery() {
    Notification.info({
        title: "Lottery has concluded",
        duration: 2000,
        description: (
            <p style={{ width: 320 }} rows={3}>
                Unfortunately, you did not win!
            </p>
        ),
    });
}

export function auctionNotFinished(expiringDate) {
    Notification.error({
        title: "Please wait until Auction finished",
        duration: 2000,
        description: (
            <p style={{ width: 320 }} rows={3}>
                Auction ends at {new Date(expiringDate * 1000).toLocaleString()}
            </p>
        ),
    });
}

export function receivedLandscape(landscape) {
    Notification.info({
        title: "You received a new landscape",
        duration: 5000,
        description: (
            <LandscapeLink landscapeId={landscape.landscapeId}>
                <NFT dna={landscape.dna} />
                <p>{landscape.name}</p>
            </LandscapeLink>
        ),
    });
}

export function withdrawAvailable() {
    Notification.info({
        title: "Withdrawal available",
        duration: 5000,
        description: <p>Withdraw your previous auction bids from the CryptoLandscape contract</p>,
    });
}

export function auctionCreated(landscape) {
    Notification.info({
        title: "New auction",
        duration: 5000,
        description: (
            <LandscapeLink landscapeId={landscape.landscapeId}>
                <NFT dna={landscape.dna} />
                <p>Landscape available for auction</p>
            </LandscapeLink>
        ),
    });
}


export function outbidModal(landscape){
    Notification.info({
        title: "You have been outbid!",
        duration: 5000,
        description: (
            <LandscapeLink landscapeId={landscape.landscapeId}>
                Your previous bid on {landscape.name} was outbid
            </LandscapeLink>
        )
    })
}