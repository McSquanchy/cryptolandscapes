// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TransferableLandscape.sol";

contract AuctionableLandscape is TransferableLandscape {
  event AuctionCreated(uint indexed auctionId, uint landscapeId, uint minPrice);
  event BidCreated(uint indexed auctionId, uint landscapeId, address bidder, uint amount, uint time);
  event AuctionFinished(uint indexed auctionId, uint landscapeId, address oldOwner, address newOwner, uint amount);

  /// contains all auctions
  mapping (uint => Auction) public auctions;

  uint auctionIdCounter = 1;

  struct Auction {
    // to be able to fetch all bids for a specific auction
    uint auctionId;
    // unix timestamps until bids are allowed
    uint endDate;
    // true if the auction is running (started but not yet finished)
    bool running;

    address payable highestBidder;
    uint highestBid;
  }

  // onyl owner of landscape can start an auction
  function startAuction(uint _landscapeId, uint _endDate, uint _minPrice) public onlyOwnerOf(_landscapeId) {
    require(_endDate > block.timestamp);
    require(auctions[_landscapeId].running == false);

    auctions[_landscapeId].auctionId = auctionIdCounter++;
    auctions[_landscapeId].endDate = _endDate;
    auctions[_landscapeId].running = true;
    auctions[_landscapeId].highestBid = _minPrice;
    auctions[_landscapeId].highestBidder = payable(address(0));
    emit AuctionCreated(auctions[_landscapeId].auctionId, _landscapeId, _minPrice);
  }

  /// Call this to bid for a landscape for which currently an auction is active.
  function bid(uint _landscapeId) public payable {
    require(auctions[_landscapeId].endDate != 0);
    require(auctions[_landscapeId].endDate > block.timestamp);
    require(auctions[_landscapeId].running == true);
    
    Auction storage auction = auctions[_landscapeId];
    uint prevHighestBid = auction.highestBid;
    // check bid is higher than previous
    require(prevHighestBid < msg.value);

    // return bid of previous bidder
    transferEther(auction.highestBidder, prevHighestBid);

    // set new highest bid
    auction.highestBid = msg.value;
    auction.highestBidder = payable(msg.sender);
    emit BidCreated(auctions[_landscapeId].auctionId, _landscapeId, msg.sender, msg.value, block.timestamp);
  }

  /// Must only be called when a auction has finished.
  /// Completes the auction by tranfering the landscape to the new owner and the auction price to the seller.
  /// Can be called by anyone.
  function endAuction(uint _landscapeId) public {
    require(auctions[_landscapeId].endDate < block.timestamp);
    require(auctions[_landscapeId].running == true);

    Auction storage auction = auctions[_landscapeId];
    uint _winnerBid = auction.highestBid;
    address payable _seller = payable(landscapeToOwner[_landscapeId]);

    if(auction.highestBidder != payable(address(0)) && auction.highestBidder != _seller){
      // pay the seller the auction
      transferEther(_seller, _winnerBid);
      // transfer landscape to new owner
      landscapeToOwner[_landscapeId] = auction.highestBidder;
      emit LandscapeTransferred(_landscapeId, _seller, auction.highestBidder, block.timestamp);
    }

    emit AuctionFinished(auctions[_landscapeId].auctionId, _landscapeId, _seller, auction.highestBidder, _winnerBid);
    // auction is finished
    auction.running = false;
  }
}
