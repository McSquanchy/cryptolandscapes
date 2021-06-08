import { useSelector } from "react-redux";
import { Button, ControlLabel, Form, FormControl, FormGroup, Icon,  List, InputNumber } from "rsuite";
import contractService from "../../web3/contract.service";
import { useUiState } from "../../hooks/landscapes";
import { useState } from "react";


export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {
  // this is my address
  const myAddress = useSelector((state) => state.app.ethAddress);
  // this is the auction data
  const auction = landscape.auction;
  const [formValue, setFormValue] = useState(0.01);
  const [valid, setValid] = useState(true);
  const [highestBid, setHighestBid] = useState();


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

const setBid = () =>{
    if (formValue <= highestBid){
        setValid(false);
    }
    else{
        setValid(true);
        contractService.bid(landscape.landscapeId, formValue)
        highestValue()
    }
};
  //calculate next bid
  const highestValue = () => {
    if (auction.bids.length != 0) {
        setHighestBid(Math.max(
        ...auction.bids.map((x) => contractService.convertWeiToEth(x.amount))
      ));
    } else {
        setHighestBid(0.01);
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
              Math.ceil(Date.now() / 1000) + 1500,
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
        <Form  layout="inline" onChange={setFormValue}>
            <FormGroup>
                <InputNumber
                    disabled={!auction.running ||isAuctionBidInProgress }
                    defaultValue={0.01}
                    step={0.01}
                    onChange={setFormValue}
                    min={highestBid}
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
