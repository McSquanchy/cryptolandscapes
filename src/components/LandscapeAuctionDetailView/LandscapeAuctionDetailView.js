import { useSelector } from "react-redux";
import { Button, Form, FormGroup, Icon,  List, InputNumber } from "rsuite";
import contractService from "../../web3/contract.service";
import { useUiState } from "../../hooks/landscapes";
import { useState } from "react";
import { valueToSmall } from "../../web3/notifications";


export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {
  // this is my address
  const myAddress = useSelector((state) => state.app.ethAddress);
  // this is the auction data
  const auction = landscape.auction;
  const [formValue, setFormValue] = useState(0.01);


  const [isAuctionStartInProgress] = useUiState(
    landscape.landscapeId,
    "processingAuctionStart"
  );
  const [isAuctionEndInProgress] = useUiState(
    landscape.landscapeId,
    "processingAuctionEnd"
  );
  const [isAuctionBidInProgress] = useUiState(
    landscape.landscapeId,
    "processingAuctionBid"
  );

  //Check if deisred value is bigger than highest bid.
const setBid = () =>{
    if (auction.bids.length != 0 && formValue <= Math.max(...auction.bids.map((x) => contractService.convertWeiToEth(x.amount)))){
        valueToSmall();
    }
    else{
        contractService.bid(landscape.landscapeId, formValue);
    }
};


  return (
    <div>
      <h4>Auction</h4>
      <span>
        {auction.running && (
          <span>
            End Date: <Icon icon="clock-o" />
            {new Date(auction.endDate * 1000).toLocaleString()}
            <br />
          </span>
        )}
      </span>
      {!auction.running && <h5> No auction running for this Landscape</h5>}
      <br></br>
      {isUserOwner && (
        <Button
          disabled={auction.running || isAuctionStartInProgress}
          onClick={() =>
            contractService.startAuction(
              landscape.landscapeId,
              Math.ceil(Date.now() / 1000) + 180,
              0
            )
          }
        >
          {" "}
          Start Auction
        </Button>
      )}
      <br />
      {!isUserOwner && (
        <Form  layout="inline" >
            <FormGroup>
                <InputNumber
                    disabled={!auction.running ||isAuctionBidInProgress }
                    defaultValue={0.01}
                    step={0.01}
                    onChange={setFormValue}
                    min={0.01}
                />
            </FormGroup>
            <FormGroup>
                <Button disabled={!auction.running|| isAuctionBidInProgress} onClick={setBid}>Bid</Button>
                
            </FormGroup>
        </Form>
      )}

      <br />
      {isUserOwner && (
        <Button
          disabled={!auction.running || isAuctionEndInProgress}
          onClick={() => contractService.endAuction(landscape.landscapeId)}
        >
          End Auction
        </Button>
      )}
      <br></br>
      {auction.running && (
        <div>
          <h5>Bids</h5>
          <List bordered>
            {(auction.bids || []).map((b, i) => (
              <List.Item key={i}>
                {contractService.convertWeiToEth(b.amount)} from {b.bidder} at{" "}
                {new Date(b.time * 1000).toLocaleString()}
              </List.Item>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
