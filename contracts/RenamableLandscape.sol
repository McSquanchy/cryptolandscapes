// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract RenamableLandscape is LandscapeFactory {
    
    uint nameChangeFee = 0.0005 ether;

    event LandscapeNameChanged(uint landscapeId, string newName);

    function setNameChangeFee(uint _fee) external onlyOwner {
        nameChangeFee = _fee;
    }

    function changeName(uint _landscapeId, string calldata _newName) external onlyOwnerOf(_landscapeId) payable {
        require(msg.value == nameChangeFee);
        landscapes[_landscapeId].name = _newName;
        emit LandscapeNameChanged(_landscapeId, _newName);
    }
}
