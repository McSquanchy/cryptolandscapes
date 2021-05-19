// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandscapeFactory {

    event NewLandscape(uint landscapeId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Landscape {
        string name;
        uint dna;
    }

    Landscape[] public landscapes;

    mapping (uint => address) public landscapeToOwner;
    mapping (address => uint) ownerLandscapeCount;

    function _createLandscape(address _owner, string memory _name, uint _dna) private {
        landscapes.push(Landscape(_name, _dna));
        uint id =  landscapes.length - 1;
        landscapeToOwner[id] = _owner;
        ownerLandscapeCount[_owner]++;
        emit NewLandscape(id, _name, _dna);
    }

    function _generateRandomDna() private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return rand % dnaModulus;
    }

    function createRandomLandscape(address _owner, string memory _name) internal {
        uint randDna = _generateRandomDna();
        _createLandscape(_owner, _name, randDna);
    }
}
