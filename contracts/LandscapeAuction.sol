// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract LandscapeAuction is LandscapeFactory {

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
}
