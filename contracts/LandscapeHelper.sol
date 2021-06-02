// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeLottery.sol";

contract LandscapeHelper is LandscapeLottery {
    
    uint nameChangeFee = 0.0005 ether;

    function setNameChangeFee(uint _fee) external onlyOwner {
        nameChangeFee = _fee;
    }

    function changeName(uint _landscapeId, string calldata _newName) external onlyOwnerOf(_landscapeId) payable {
        require(msg.value == nameChangeFee);
        landscapes[_landscapeId].name = _newName;
    }
 
    struct LandscapeWithOwner {
        string name;
        uint dna;
        address owner;
        Auction auction;
    }

    function getLandscapes() public view returns (LandscapeWithOwner[] memory) {
        LandscapeWithOwner[] memory forExport = new LandscapeWithOwner[](landscapes.length);
        for (uint i = 0; i < landscapes.length; i++) {
            forExport[i] = LandscapeWithOwner(landscapes[i].name, landscapes[i].dna, landscapeToOwner[i], auctions[i]);
        }
        return forExport;
    }

}
