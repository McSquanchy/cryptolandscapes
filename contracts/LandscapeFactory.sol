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

    function _createLandscape(string memory _name, uint _dna) private {
        landscapes.push(Landscape(_name, _dna));
        uint id =  landscapes.length - 1;
        landscapeToOwner[id] = msg.sender;
        ownerLandscapeCount[msg.sender]++;
        emit NewLandscape(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomLandscape(string memory _name) public {
        uint randDna = _generateRandomDna(_name);
        _createLandscape(_name, randDna);
    }
}
