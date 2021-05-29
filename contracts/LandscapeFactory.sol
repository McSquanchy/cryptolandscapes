// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WithdrawalPattern.sol";

contract LandscapeFactory is WithdrawalPattern {
    event NewLandscape(uint landscapeId, string name, uint dna);

    uint featureDigits = 14;
    uint imageModulus = 7;
    uint featureModulus = 10 ** featureDigits;

    struct Landscape {
        string name;
        uint dna;
    }

    Landscape[] public landscapes;

    mapping (uint => address) public landscapeToOwner;
    mapping (address => uint) ownerLandscapeCount;

    function getLandscapeCount() public view returns (uint){
        return landscapes.length;
    }
    
    modifier onlyOwner(uint landscapeId) {
        require(msg.sender == landscapeToOwner[landscapeId]);
        _;
    }

    function _createLandscape(address _owner, string memory _name, uint _dna) private {
        landscapes.push(Landscape(_name, _dna));
        uint id =  landscapes.length - 1;
        landscapeToOwner[id] = _owner;
        ownerLandscapeCount[_owner]++;
        emit NewLandscape(id, _name, _dna);
    }

    function _generateRandomDna() private view returns (uint) {
        uint randomFeatures = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % featureModulus;
        uint randomImage = ((uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % imageModulus) + 10) * featureModulus; 
        return randomImage + randomFeatures;
    }

    function createRandomLandscape(address _owner, string memory _name) internal {
        uint randDna = _generateRandomDna();
        _createLandscape(_owner, _name, randDna);
    }
}
