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
  FormControl,
  Schema,
  ButtonToolbar,
  DateRangePicker,
  Message
} from "rsuite";
import contractService from "../../web3/contract.service";
import { useUiState } from "../../hooks/landscapes";
import { useState } from "react";
import { valueToSmall } from "../../web3/notifications";
import store from "../../state/store";


export default function LandscapeAuctionDetailView({ landscape, isUserOwner }) {
  // this is my address
  const myAddress = useSelector((state) => state.app.ethAddress);
  // this is the auction data
  const auction = landscape.auction;
  const auctionHighestBid = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBid);
  const auctionHighestBidder = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.highestBidder);
  const auctionEndDate = useSelector((state) => state.landscapes.landscapes[Number(landscape.landscapeId)].auction.endDate);
  

  const [formValue, setFormValue] = useState(contractService.convertWeiToEth(auctionHighestBid));
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
    console.log(contractService.convertWeiToEth(auctionHighestBid));  
    if (formValue <= contractService.convertWeiToEth(auctionHighestBid))

     {
      console.log("Form Value:  " ,formValue);
      console.log("Highest Bid:  " ,contractService.convertWeiToEth(auctionHighestBid));
      valueToSmall();
    } else {
      console.log("Form Value:  " ,formValue);
      console.log("Highest Bid:  " ,contractService.convertWeiToEth(auctionHighestBid));
      contractService.bid(landscape.landscapeId, formValue);
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
      {auctionEndDate < Date.now()*1000 &&     <Message
      showIcon
      type="info"
      title="Informational"
      description="Auction has expired. The owner or the winner can end it."
      closable="true"
    />}


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
      {!isUserOwner  && (
        <Form layout="inline">
          <FormGroup>
            <InputNumber
              disabled={!auction.running || isAuctionBidInProgress || auctionEndDate < Date.now()*1000}
              defaultValue={Number(contractService.convertWeiToEth(auction.highestBid))}
              step={0.001}
              onChange={setFormValue}
              min={Number(contractService.convertWeiToEth(auction.highestBid))}
            />
          </FormGroup>
          <FormGroup>
            <Button
              disabled={!auction.running || isAuctionBidInProgress || auctionEndDate < Date.now()*1000}
              onClick={setBid}
            >
              Bid
            </Button>
          </FormGroup>
        </Form>
      )}

      <br />
      {isUserOwner  && (
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
