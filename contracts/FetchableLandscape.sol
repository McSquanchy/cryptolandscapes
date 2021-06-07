// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AuctionableLandscape.sol";
import "./LandscapeLottery.sol";
import "./RenamableLandscape.sol";
import "./TransferableLandscape.sol";

contract FetchableLandscape is AuctionableLandscape, LandscapeLottery, RenamableLandscape {
    struct LandscapeWithOwner {
        string name;
        uint dna;
        address owner;
        Auction auction;
    }

    function getLandscapes() public view returns (LandscapeWithOwner[] memory) {
        LandscapeWithOwner[] memory forExport = new LandscapeWithOwner[](landscapes.length);
        for (uint i = 0; i < landscapes.length; i++) {
            forExport[i] = getLandscape(i);
        }
        return forExport;
    }

    function getLandscape(uint landscapeId) public view returns (LandscapeWithOwner memory){
        return LandscapeWithOwner(landscapes[landscapeId].name, landscapes[landscapeId].dna, landscapeToOwner[landscapeId], auctions[landscapeId]);
    }
}