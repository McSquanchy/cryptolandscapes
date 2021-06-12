// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Security measure
/// https://docs.soliditylang.org/en/v0.8.4/common-patterns.html#withdrawal-pattern
contract WithdrawalPattern {
    
    event PendingWithdrawalChanged(address addr);

    mapping (address => uint) pendingWithdrawals;
    
    function transferEther(address _addr, uint _amount) internal {
        pendingWithdrawals[_addr] += _amount;
        emit PendingWithdrawalChanged(_addr);
    }

    function getMyBalance() external view returns (uint) {
        return pendingWithdrawals[msg.sender];
    }

    /// User must call this function to receive ether from lost bids
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}