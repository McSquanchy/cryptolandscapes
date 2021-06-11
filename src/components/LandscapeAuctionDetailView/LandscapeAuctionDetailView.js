import { useSelector } from "react-redux";
import {
  Button,
  Form,
  FormGroup,
  Icon,
  List,
  InputNumber,
  Modal,
  ControlLabel,
  ButtonToolbar,
  Message
} from "rsuite";
import contractService from "../../web3/contract.service";
import { useUiState } from "../../hooks/landscapes";
import { useState, useEffect } from "react";
import { valueToSmall,auctionNotFinished} from "../../web3/notifications";


export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {

  //Calculate the next higher Bid
  const getNextBid = () => {
    return Number(Number(contractService.convertWeiToEth(auction.highestBid))+Number(0.001));
  }
  // this is my address
  const myAddress = useSelector((state) => state.app.ethAddress);
  // this is the auction data
  const auction = landscape.auction;
  const auctionHighestBid = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBid);
  const auctionHighestBidder = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBidder);
  const auctionEndDate = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.endDate);
  

  const [formValueBid, setFormValueBid] = useState(getNextBid());
  const [showModal, setShowModal] = useState();
  const [formValueTime, setFormvalueTime] = useState(1);
  const [formValueAmount, setFormvalueAmount] = useState(0.01);


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
  const setBid = () => {
    if (formValueBid <= contractService.convertWeiToEth(auctionHighestBid))
     {
      valueToSmall(contractService.convertWeiToEth(auctionHighestBid));
    } else {
      contractService.bid(landscape.landscapeId, formValueBid);
    }
  };

  const submitForm = () => {
    setShowModal(false);
    contractService.startAuction(
      landscape.landscapeId,
      Math.ceil(Date.now() / 1000) + formValueTime * 60,
      formValueAmount + ""
    );
  };

  const submitEndOfAuction = () =>{
    if(auctionEndDate > Math.ceil(Date.now() / 1000)){
      console.log("Fuuuuck");
      auctionNotFinished(auctionEndDate);
    }
    else{
      console.log(auctionEndDate,"   ", Math.ceil(Date.now() / 1000) );
      contractService.endAuction(landscape.landscapeId)
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
      {!auction.running && !isUserOwner && ( <Message  showIcon type="info" description="There is no ongoing auction for this beauty" />)}



      <br></br>
      {isUserOwner && (
        <Button
          disabled={auction.running || isAuctionStartInProgress}
          onClick={() => setShowModal(true)}
        >
          {" "}
          Start Auction
        </Button>
      )}
      <br />
      {!isUserOwner && auction.running && (auctionEndDate > Math.ceil(Date.now() / 1000)) && (
        <Form layout="inline">
          <FormGroup>
            <InputNumber
              disabled={isAuctionBidInProgress}
              defaultValue={getNextBid()}
              step={0.001}
              onChange={setFormValueBid}
              min={getNextBid()}
            />
          </FormGroup>
          <FormGroup>
            <Button
              disabled={isAuctionBidInProgress}
              onClick={setBid}
            >
              Bid
            </Button>
          </FormGroup>
        </Form>
      )}

      <br />
      {(isUserOwner || myAddress==auctionHighestBidder && (auctionEndDate < Math.ceil(Date.now() / 1000)))  && (
        <Button
          disabled={!auction.running || isAuctionEndInProgress }
          onClick={submitEndOfAuction}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Create a new Auction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <ControlLabel>Duration in Minutes</ControlLabel>
              <InputNumber
                defaultValue={1}
                step={1}
                onChange={setFormvalueTime}
                min={1}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Startprice</ControlLabel>
              <InputNumber
                defaultValue={0.001}
                step={0.001}
                onChange={setFormvalueAmount}
                min={0.001}
              />
            </FormGroup>
            <ButtonToolbar>
              <Button appearance="primary" type="submit" onClick={submitForm}>
                Submit
              </Button>
            </ButtonToolbar>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


     
    </div>
  );
}
