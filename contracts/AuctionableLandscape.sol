// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract AuctionableLandscape is LandscapeFactory {
  event AuctionCreated(uint landscapeId);
  event BidCreated(uint landscapeId, address bidder, uint amount);
  event AuctionFinished(uint landscapeId, address oldOwner, address newOwner, uint amount);
  
  function getLandscapesByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerLandscapeCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < landscapes.length; i++) {
      if (landscapeToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  // contains the landscapeId of all _active_ auctions
  uint[] public activeAuctions;

  /// contains all auctions
  mapping (uint => Auction) public auctions;


  struct Auction {
    uint landscapeId;
    uint minPrice;
    uint endDate;
    bool running;

    Bid[] bids;
  }

  struct Bid {
    address payable bidder;
    uint amount;
    uint date;
  }

  // onyl owner of landscape can start an auction
  function startAuction(uint _landscapeId, uint _endDate, uint _minPrice) public onlyOwnerOf(_landscapeId) {
    require(_endDate > block.timestamp);
    require(auctions[_landscapeId].running == false);

    auctions[_landscapeId].landscapeId = _landscapeId;
    auctions[_landscapeId].minPrice = _minPrice;
    auctions[_landscapeId].endDate = _endDate;
    auctions[_landscapeId].running = true;
    delete auctions[_landscapeId].bids; // remove all bids from old auction
    activeAuctions.push(_landscapeId);
    emit AuctionCreated(_landscapeId);
  }

  /// Call to bid for a landscape for which currently an auction is active.
  function bid(uint _landscapeId) public payable {
    require(auctions[_landscapeId].endDate != 0);
    require(auctions[_landscapeId].endDate > block.timestamp);
    
    Auction storage auction = auctions[_landscapeId];
    if(auction.bids.length > 0){
      Bid storage _prevBid = auction.bids[auction.bids.length - 1];
      // check bid is higher than previous
      require(_prevBid.amount < msg.value);

      // return bid of previous bidder
      transferEther(_prevBid.bidder, _prevBid.amount);
    } else {
      require(auction.minPrice < msg.value);
    }

    Bid memory _bid = Bid(payable(msg.sender), msg.value, block.timestamp);
    auction.bids.push(_bid);
    emit BidCreated(_landscapeId, msg.sender, msg.value);
  }

  /// Must only be called when a auction has finished.
  /// Completes the auction by tranfering the landscape to the new owner and the auction price to the seller.
  /// Can be called by anyone.
  function endAuction(uint _landscapeId) public {
    require(auctions[_landscapeId].endDate < block.timestamp);
    require(auctions[_landscapeId].running == true);

    Auction storage auction = auctions[_landscapeId];
    if(auction.bids.length > 0){
      Bid memory _winnerBid = auction.bids[auction.bids.length - 1];

      // pay the seller the auction
      address payable _seller = payable(landscapeToOwner[_landscapeId]);
      transferEther(_seller, _winnerBid.amount);

      // transfer landscape to new owner
      landscapeToOwner[_landscapeId] = _winnerBid.bidder;
      emit AuctionFinished(_landscapeId, _seller, _winnerBid.bidder, _winnerBid.amount);
    }

    // remove auction from list
    auction.running = false;
    removeAuctionFromActiveAuctionList(_landscapeId); 
  }

  function removeAuctionFromActiveAuctionList(uint landscapeId) private {
    uint index;
    for (uint i = 0; i < activeAuctions.length; i++) {
      if (activeAuctions[i] == landscapeId) {
        index = i;
        break;
      }
    }

    // from https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array
    if (activeAuctions.length > 1) {
      activeAuctions[index] = activeAuctions[activeAuctions.length-1];
    }
    activeAuctions.pop(); // Implicitly recovers gas from last element storage
  }
}
