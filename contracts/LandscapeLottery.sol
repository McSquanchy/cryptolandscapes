// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract LandscapeLottery is LandscapeFactory {
    event LandscapeLotteryFinished(address winner, address resolver);

    uint participationFee = 0.0005 ether;
    uint maxResolveReward = 1.0 ether;

    address[] public lotteryParticipants;
    mapping (address => bool) participants;

    function isParticipating() public view returns (bool) {
        return participants[msg.sender] == true;
    }

    modifier payedParticipationFee() {
        require(msg.value == participationFee);
        _;
    }

    modifier notAlreadyParticipating() {
        require(participants[msg.sender] == false);
        _;
    }

    function participate() public payable payedParticipationFee notAlreadyParticipating {
        // require(msg.value == participationFee);
        // require(participants[msg.sender] == false);
        lotteryParticipants.push(msg.sender);
        participants[msg.sender] = true;
    }

    function resolve() public payable {
        // if(lotteryParticipants.length < 2){
        //     return;
        // }

        // Pick winner from participants
        uint reward = lotteryParticipants.length * participationFee;
        if(reward > maxResolveReward){
            // Limit reward
            reward = maxResolveReward;
        }
        uint winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % lotteryParticipants.length;
        address winnerAddr = lotteryParticipants[winnerIndex];
        
        // Distribute Lottery price
        createRandomLandscape(winnerAddr, "Landscape");

        // Reset lottery
        resetLottery();

        // Reward for resolver
        address payable resolver = payable(msg.sender);
        resolver.transfer(reward);

        emit LandscapeLotteryFinished(winnerAddr, msg.sender);
    }

    function resetLottery() private {
        for (uint i = 0; i < lotteryParticipants.length; i++) {
            delete participants[lotteryParticipants[i]];
        }
        delete lotteryParticipants;
    }
}