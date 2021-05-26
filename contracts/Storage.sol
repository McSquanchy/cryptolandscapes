// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.5;
contract Storage {
    struct SaveStruct {
        string name;
        address owner;
    }

    SaveStruct store;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event NewData(string _name);

    function put(string memory _name) public onlyOwner {
        store = SaveStruct(_name, msg.sender);
        emit NewData(_name);
    }

    function read() public view returns (string memory, address) {
        return (store.name, store.owner);
    }
}