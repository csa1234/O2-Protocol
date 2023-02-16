// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.8.17;

    contract Crowdsale {
        using SafeMath for uint256;
        struct VestingInfo {
            address user;
            uint256 totalVestedTokens;
            uint256 dailyVestedTokens;
            uint256 claimAmount;
        }
        mapping (address => VestingInfo) public vestingInfo;
        uint256 claimable_store;
        bool claim24h;
        uint256 claimtime;
        uint256 accumulatedTokens;
        uint256 daysPassed;
        uint256 currentTime;
        uint256 timePassed;
        address public owner;
        ERC20 public token;
        address payable treasuryAddress;
        uint public rate;
        address tokenAddress;
        string tokenName;
        bool public paused;
        uint public round;
        uint256 public supply;
        bool public vestingStart;
        uint public round0_Supply;
        uint256 public round1_Supply;
        uint256 public round2_Supply;
        uint256 public round3_Supply;
        uint public round0_Rate;
        uint256 public round1_Rate;
        uint256 public round2_Rate;
        uint256 public round3_Rate;
        event Pause();
        
        constructor() {
            treasuryAddress = payable(0x75f2F9e62e965670e77aaDc71Cef043fFbd5F383);
            tokenAddress = 0x61612Ba3bEbA5D46cF652e67e9789f6C1cA17B83;
            token = ERC20(tokenAddress);
            tokenName = "TEST0031";
            owner = msg.sender;
            currentTime = block.timestamp;
            timePassed = 0;
            claimtime = 0;
            vestingStart = false;
            claim24h = false;
            round0_Supply = 0;
            round1_Supply = 12500000 * 10**18;
            round2_Supply = 6250000 * 10**18;
            round3_Supply = 6250000 * 10 **18;
            round0_Rate = 0 ether;
            round1_Rate = 1.45 ether;
            round2_Rate = 1.35 ether;
            round3_Rate = 1.25 ether;
            rate = 1;
            round = 1;
            supply = round1_Supply;
            paused = false;
        }

        function setNewOwner(address _newOwner) public {
            require((msg.sender == owner), "Only the current owner can set a new owner.");
            owner = _newOwner;
        }

        function set_treasury(address _newtreasury) public {
            require((msg.sender == owner), "Only the current owner can set a new owner.");
            treasuryAddress = payable(_newtreasury);
        }

        function setRound(uint _round) public {
        require(msg.sender == owner); 
        round = _round;
            if (round == 1) {
                supply = round1_Supply;
                rate = round1_Rate;
            } else if (round == 2) {
                supply = round2_Supply;
                rate = round2_Rate;
            } else if (round == 3) {
                supply = round3_Supply;
                rate = round3_Rate;
            } else if (round == 0) {
                supply = round0_Supply;
                rate = round0_Rate;
            }
        }
        
        function buyTokens() public payable {
            require(paused == false);
            require(msg.value > 0);
            uint256 tokens = msg.value.div(rate);
            require (supply >= 0, "The token cap has been reached.");
            vestingInfo[msg.sender].totalVestedTokens += tokens;
            vestingInfo[msg.sender].dailyVestedTokens = (vestingInfo[msg.sender].totalVestedTokens / 365);
            supply = supply.sub(tokens);
            tokens = 0;
            vestingInfo[msg.sender].claimAmount = vestingInfo[msg.sender].dailyVestedTokens;
        }
        
        function setVesting (bool _vestingStart) public {
            require(msg.sender == owner);
            require (round == 0);
            vestingStart = _vestingStart;
            claimtime = block.timestamp;
        }
       
        function pause() public {
        require(msg.sender == owner);
        paused = true;
        emit Pause();
        }

        function unpause() public {
        require(msg.sender == owner);
        paused = false;
        emit Pause();
        }

        function _forwardFunds() payable public {
        require(msg.sender == owner);
        treasuryAddress.transfer(msg.value);
        }
        
        function claimVesting() public {
            timer(); 
            require (claim24h == true);
            VestingInfo storage userVestingInfo = vestingInfo[msg.sender];
            accumulateVesting();
            claimable_store = userVestingInfo.claimAmount;
            address recipient = msg.sender;
            require(token.transfer(recipient, claimable_store), "Unable to transfer tokens");
            vestingInfo[msg.sender].claimAmount = 0;
            claimable_store = 0;
            claimtime = block.timestamp;
            accumulatedTokens = 0;
            claim24h = false;
        }
 
        function accumulateVesting() internal {
            currentTime = block.timestamp;
            timePassed = currentTime - claimtime;
            daysPassed = timePassed; // 86400;
            accumulatedTokens = daysPassed * vestingInfo[msg.sender].dailyVestedTokens;
            if (accumulatedTokens >= vestingInfo[msg.sender].totalVestedTokens){
                vestingInfo[msg.sender].claimAmount = vestingInfo[msg.sender].totalVestedTokens;
            }else if (accumulatedTokens <= vestingInfo[msg.sender].dailyVestedTokens){
                vestingInfo[msg.sender].claimAmount = accumulatedTokens;
            }
        }

        function timer() internal {
            currentTime = block.timestamp;
            timePassed = (currentTime - claimtime);
            if (timePassed >= 1){  //MODIFICAR A 86400    
                claim24h = true;
            }
        }

        //esta por verse si es necesario
        function approve_claim() public returns (bool) {
            require(token.approve(msg.sender, claimable_store), "Failed to approve the transfer");
            return true;
        }
    }