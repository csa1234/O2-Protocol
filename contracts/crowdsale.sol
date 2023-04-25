
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/finance/VestingWallet.sol";



pragma solidity ^0.8.18;

    contract Crowdsales {
        using SafeMath for uint256;
        struct VestingInfo {
            address user;
            uint256 totalVestedTokens;
            uint256 dailyVestedTokens;
            uint256 claimAmount;
            uint256 claimtime;
            bool claim24h;
        }

        mapping (address => VestingInfo) public vestingInfo;
        uint256 Claimtime;
        bool Claim24h;
        uint256 claimable_store;
        uint256 accumulatedTokens;
        uint256 daysPassed;
        uint256 currentTime;
        uint256 timePassed;
        address public owner;
        ERC20 public token;
        uint public rate;
        address tokenAddress;
        string tokenName;
        bool public paused;
        uint public round;
        uint256 public supply;
        bool public vestingStart;
        uint round0_Supply;
        uint256 round1_Supply;
        uint256 round2_Supply;
        uint256 round3_Supply;
        uint round0_Rate;
        uint256 round1_Rate;
        uint256 round2_Rate;
        uint256 round3_Rate;
        address _Newowner;
        uint256 public TokenSold;
        uint256 public TotalAmount;
        uint256 claimAmount;
        event Pause();
        event Start();
        event Stop();

        
        constructor() {
            tokenAddress = 0x1c64DaA605358e97fE365077C08d35C1E71D97C9;
            token = ERC20(tokenAddress);
            tokenName = "O2PR";
            owner = msg.sender;
            round0_Supply = 0;
            round1_Supply = 12500000 * 10**18;
            round2_Supply = 6250000 * 10**18;
            round3_Supply = 6250000 * 10 **18;
            round0_Rate = 0;
            round1_Rate = 1538461538461538000;
            round2_Rate = 1492537313432836000;
            round3_Rate = 1449275362318841000;
            rate = 1538461538461538000;
            round = 1;
            supply = round1_Supply;
            TokenSold = 0 ether;
            TotalAmount = 12500000 * 10**18;
        }

        function setNewTokenAddress(address _newTokenAddress) public {
            require((msg.sender == owner), "Only the current owner can set a new owner.");
            tokenAddress = _newTokenAddress;
            token = ERC20(tokenAddress);
        }

        function setNewOwner(address _newOwner) public {
            require((msg.sender == owner), "Only the current owner can set a new owner.");
            owner = _newOwner;
        }

        function Vault (address payable _to) public {
            require (msg.sender == owner);
            _to.transfer(address(this).balance);
        }

        function setRound(uint _round) public {
        require(msg.sender == owner); 
        round = _round;
            if (round == 1) {
                supply = round1_Supply;
                rate = round1_Rate;
                TotalAmount = round1_Supply;
            } else if (round == 2) {
                supply = round2_Supply;
                rate = round2_Rate;
                TotalAmount = round2_Supply;
            } else if (round == 3) {
                supply = round3_Supply;
                rate = round3_Rate;
                TotalAmount = round3_Supply;
            } else if (round == 0) {
                supply = round0_Supply;
                rate = round0_Rate;
                TotalAmount = round0_Supply;
            }
        }

        function addtoken(address _to, uint256 _tokens) public {
            require(msg.sender == owner);
            require (supply > 0, "The token cap has been reached.");
            uint256 tokens = _tokens;
            TokenSold += tokens;
            supply = supply.sub(tokens);
            vestingInfo[_to].user = _to;
            vestingInfo[_to].totalVestedTokens = vestingInfo[_to].totalVestedTokens + tokens;
            vestingInfo[_to].dailyVestedTokens = vestingInfo[_to].totalVestedTokens / 365;
            vestingInfo[_to].claimAmount = vestingInfo[_to].dailyVestedTokens;
            tokens = 0;
        }
        
        function buyTokens() payable public {
            require(paused == false);
            require(msg.value > 0);
            require (supply > 0, "The token cap has been reached.");
            uint256 tokens = (msg.value * rate) / 1 ether;
            TokenSold += tokens;
            supply = supply.sub(tokens);
            vestingInfo[msg.sender].user = msg.sender;
            vestingInfo[msg.sender].totalVestedTokens = vestingInfo[msg.sender].totalVestedTokens + tokens;
            vestingInfo[msg.sender].dailyVestedTokens = vestingInfo[msg.sender].totalVestedTokens / 365;
            vestingInfo[msg.sender].claimAmount = vestingInfo[msg.sender].dailyVestedTokens;
            tokens = 0;
        }

        function setVesting () public {
            require(msg.sender == owner);
            require (round == 0);
            vestingStart = true;
            emit Start();
        }

        function stopVesting () public {
            require(msg.sender == owner);
            require (round == 0);
            vestingStart = false;
            emit Stop();
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

        function claimVesting() public {
            require (vestingStart == true);
            VestingInfo storage userVestingInfo = vestingInfo[msg.sender];
            Claimtime = userVestingInfo.claimtime;
            claimable_store = userVestingInfo.claimAmount;
            timer(); 
            require (vestingInfo[msg.sender].claim24h == true);
            accumulateVesting();
            
            address recipient = msg.sender;
            require(token.approve(address(this), claimAmount), "Failed to approve the transfer");
            require(token.transfer(recipient, claimable_store), "Unable to transfer tokens");
            vestingInfo[msg.sender].totalVestedTokens -= claimable_store; 
            if (vestingInfo[msg.sender].dailyVestedTokens <= vestingInfo[msg.sender].totalVestedTokens) { 
                vestingInfo[msg.sender].claimAmount = vestingInfo[msg.sender].dailyVestedTokens;
            }else if (vestingInfo[msg.sender].dailyVestedTokens > vestingInfo[msg.sender].totalVestedTokens){
                vestingInfo[msg.sender].claimAmount = 0;
            }
            claimable_store = 0;
            vestingInfo[msg.sender].claimtime = block.timestamp;
            Claimtime = 0;
            Claim24h = false;
            accumulatedTokens = 0;
            vestingInfo[msg.sender].claim24h = false;
        }
 
        function accumulateVesting() internal {
            currentTime = block.timestamp;
            timePassed = currentTime - Claimtime;
            daysPassed = timePassed / 86400;
            accumulatedTokens = daysPassed * vestingInfo[msg.sender].dailyVestedTokens;
            if (accumulatedTokens >= vestingInfo[msg.sender].totalVestedTokens){
                vestingInfo[msg.sender].claimAmount = vestingInfo[msg.sender].totalVestedTokens;
            }else if (accumulatedTokens <= vestingInfo[msg.sender].totalVestedTokens){
                vestingInfo[msg.sender].claimAmount = accumulatedTokens;
            }
        }
 
        function timer() internal {
            currentTime = block.timestamp;
            timePassed = (currentTime - Claimtime);
            if (timePassed >= 86400){      
                vestingInfo[msg.sender].claim24h = true;
            }
        }

        
    }