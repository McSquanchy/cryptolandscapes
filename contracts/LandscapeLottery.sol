// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandscapeFactory.sol";

contract LandscapeLottery is LandscapeFactory {
    event LandscapeLotteryFinished(address winner, address resolver);
    event LandscapeLotterySharesPurchased(uint nrOfParticipants);
    event LandscapeLotteryNewParticipant();

    uint participationFee = 0.0005 ether;
    uint maxResolveReward = 1.0 ether;
    uint totalAmountOfShares = 0;

    address[] public lotteryParticipants;
    mapping (address => bool) winners;
    mapping (address => bool) participants;
    mapping (address => uint) participantShares;

    modifier payedParticipationFee(uint amount) {
        require(msg.value == participationFee*amount);
        _;
    }
    
    function isParticipating() public view returns (bool) {
        return participants[msg.sender] == true;
    }

    modifier Participating() {
        require(participants[msg.sender] == true);
        _;
    }

    modifier isWinner() {
        require(winners[msg.sender] == true);
        _;
    }

    function getTotalAmountOfShares() public view Participating returns (uint) {
        return totalAmountOfShares;
    }

    function getMyShares() external view Participating returns (uint) {
        return participantShares[msg.sender];
    }

    function participate(uint amount) public payable payedParticipationFee(amount)  {
        if(!participants[msg.sender] == true) {
            lotteryParticipants.push(msg.sender);
            participants[msg.sender] = true;
            participantShares[msg.sender] = 1;
            emit LandscapeLotteryNewParticipant();
        } else {
            participantShares[msg.sender] += amount;
        }
        totalAmountOfShares+= amount;  
        emit LandscapeLotterySharesPurchased(totalAmountOfShares);
    }

    function getParticipants() public view onlyOwner returns(address[] memory) {
        return lotteryParticipants;
    }

    function getLatestParticipant() public view onlyOwner returns (address) {
        return lotteryParticipants[lotteryParticipants.length-1];
    }

    function resolve() public payable onlyOwner {
        // if(lotteryParticipants.length < 2){
        //     return;
        // }

        // Pick winner from participants
        uint reward = lotteryParticipants.length * participationFee;
        if(reward > maxResolveReward){
            // Limit reward
            reward = maxResolveReward;
        }
        uint winningLot = (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % totalAmountOfShares);
        uint shares = 0;
        uint index = 0;
        while(shares < winningLot) {
            shares += participantShares[lotteryParticipants[index]];
            index++;
        }
        address winnerAddr = lotteryParticipants[index];
        winners[winnerAddr] = true;

        // Distribute Lottery price
        // createRandomLandscape(winnerAddr, "Landscape");

        // Reset lottery
        resetLottery();

        // Reward for resolver
        address payable resolver = payable(msg.sender);
        resolver.transfer(reward);

        emit LandscapeLotteryFinished(winnerAddr, msg.sender);
    }

    function withDrawLandscape(string calldata _desiredName) public isWinner {
        createRandomLandscape(msg.sender, _desiredName);
        winners[msg.sender] = false;
    }

    function resetLottery() private {
        totalAmountOfShares = 0;
        for (uint i = 0; i < lotteryParticipants.length; i++) {
            delete participants[lotteryParticipants[i]];
            delete participantShares[lotteryParticipants[i]];
        }
        delete lotteryParticipants;
    }
}