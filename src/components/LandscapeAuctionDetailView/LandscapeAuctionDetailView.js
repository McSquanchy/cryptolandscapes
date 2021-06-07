import { useSelector } from "react-redux";
import { Button } from "rsuite";
import contractService from "../../web3/contract.service";

export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {
    // this is my address
    const myAddress = useSelector((state) => state.app.ethAddress);
    // this is the auction data
    const auction = landscape.auction;
    return (
        <div>
            <span>
                Auction of LandscapeID: {auction.id} (End Date: {new Date(auction.endDate * 1000).toISOString()}<br></br>
                Is running: {auction.running + ""}
            </span>
            <br></br>
            <Button onClick={() => contractService.startAuction(landscape.landscapeId, Math.ceil(Date.now() / 1000) + 60, 0)}>Start auction</Button>
            <br />
            <Button onClick={() => contractService.bid(landscape.landscapeId, "0.06")}>Bid</Button>
            <br />
            <Button onClick={() => contractService.endAuction(landscape.landscapeId)}>End auction</Button>
            <br></br>
            <h5>Bids</h5>
            <ul>
                {(auction.bids || []).map((b, i) => (
                    <li key={i}>
                        {b.amount} from {b.bidder} at {b.time}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// old code
//  <Button
// type="button"
// onClick={() =>
//   contractService.startAuction(
//     props.id,
//     Math.ceil(Date.now() / 1000) + 60,
//     0
//   )
// }
// color="blue"
// >
// Start auction
// </Button>
// Old code from auctionList
// const auctions = useSelector(state => state.auctions.auctions);
// console.log('list', auctions);
// return <fieldset>
//     <legend>Auctions</legend>
//     {auctions.map(auction => (
//         <li key={auction.id}>
//             <span>Auction of LandscapeID: {auction.id} (End Date: {(new Date(auction.endDate * 1000)).toISOString()} Min Price: {auction.minPrice})</span><br></br>
//             <button type="button" onClick={() => contractService.bid(auction.id, "0.06")}>Bid</button><br />
//             <button type="button" onClick={() => contractService.endAuction(auction.id)}>End auction</button>
//         </li>
//     ))}
// </fieldset>
