import { useSelector } from "react-redux";

import contractService from "./web3/contract.service";

export default function AuctionList(props){
    const auctions = useSelector(state => state.auctions.auctions);
    console.log('list', auctions);
    return <fieldset>
        <legend>Auctions</legend>
        {auctions.map(auction => (
            <li key={auction.id}>
                <span>Auction of LandscapeID: {auction.id} (End Date: {(new Date(auction.endDate * 1000)).toISOString()} Min Price: {auction.minPrice})</span><br></br>
                <button type="button" onClick={() => contractService.bid(auction.id, "0.06")}>Bid</button><br />
                <button type="button" onClick={() => contractService.endAuction(auction.id)}>End auction</button>
            </li>
        ))}
    </fieldset>

}

