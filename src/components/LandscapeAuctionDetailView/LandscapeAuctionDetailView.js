import { useSelector } from "react-redux"


export default function LandscapeAuctionDetailView({landscape, isUserOwner}){
    // this is my address
    const myAddress = useSelector(state => state.app.ethAddress);
    // this is the auction data
    const auction = landscape.auction;
    return <p>Auction information for landscape</p>
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