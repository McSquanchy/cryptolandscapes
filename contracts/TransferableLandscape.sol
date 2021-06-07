// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract TransferableLandscape is LandscapeFactory {
    
    event LandscapeTransferred(uint indexed landscapeId, address oldOwner, address newOwner, uint time);

    function transferLandscape(uint _landscapeId, address _newOwner) external onlyOwnerOf(_landscapeId) {
        address oldOwner = landscapeToOwner[_landscapeId];
        landscapeToOwner[_landscapeId] = _newOwner;
        emit LandscapeTransferred(_landscapeId, oldOwner, _newOwner, block.timestamp);
    }
}
