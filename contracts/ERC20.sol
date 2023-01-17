pragma solidity ^0.8.7;
import "https://github.com/polygon-network/smart-contracts/contracts/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/math/SafeMath.sol";

contract Testo2p {
    using SafeMath for uint256;

    // Token details
    string public name = "TESTO2P";
    string public symbol = "O2P";
    uint8 public decimals = 18;
    uint256 public totalSupply = 100000000e18;
    uint256 public seedRoundTokens = 12500000e18;
    uint256 public privateSaleATokens = 6250000e18;
    uint256 public privateSaleBTokens = 6250000e18;

    // Token prices
    uint256 public seedRoundPrice = 45e18; //0.45 USDT
    uint256 public privateSaleAPrice = 65e18; //0.65 USDT
    uint256 public privateSaleBPrice = 85e18; //0.85 USDT
    address private owner;
    bool private paused = true;

    // Sale date
    uint256 public seedRoundStartTime = 1611369600;
    uint256 public seedRoundEndTime = 16125792000;
    uint256 public privateSaleAStartTime = 1613129600;
    uint256 public privateSaleAEndTime = 1614339200;
    uint256 public privateSaleBStartTime = 1614889600;
    uint256 public privateSaleBEndTime = 1616092800;

    // Vesting
    mapping(address => uint256) public vesting;
    mapping(address => uint256) public vested;
    uint256 public constant VESTING_MONTHS = 12;
    uint256 public constant VESTING_RATE = 8.33;

    // Backup address
    address private backupAddress;

    // Events
    event Pause();
    event Unpause();

    constructor(address _backupAddress) public {
        owner = msg.sender;
        backupAddress = _backupAddress;
    }

    function setSeedRoundStartTime(uint256 _startTime) public onlyOwner {
        seedRoundStartTime = _startTime;
    }

    function setSeedRoundEndTime(uint256 _endTime) public onlyOwner {
        seedRoundEndTime = _endTime;
    }

    function setPrivateSaleAStartTime(uint256 _startTime) public onlyOwner {
        privateSaleAStartTime = _startTime;
    }

    function setPrivateSaleAEndTime(uint256 _endTime) public onlyOwner {
        privateSaleAEndTime = _endTime;
    }

    function setPrivateSaleBStartTime(uint256 _startTime) public onlyOwner {
        privateSaleBStartTime = _startTime;
    }

    function setPrivateSaleBEndTime(uint256 _endTime) public onlyOwner {
        privateSaleBEndTime = _endTime;
    }

    function setBackupAddress(address newBackupAddress) public onlyOwner {
        backupAddress = newBackupAddress;
    }
   
    function _transfer(address to, uint256 tokens) internal {
        require(balanceOf[msg.sender] >= tokens);
        require(balanceOf[to] + tokens >= balanceOf[to]);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(tokens);
        balanceOf[to] = balanceOf[to].add(tokens);
    }

    function pause() public onlyOwner {
        require(!paused, "The contract is already paused");
        paused = true;
        emit Pause();
    }

    function unpause() public onlyOwner {
        require(paused, "The contract is already unpaused");
        paused = false;
        emit Unpause();
    }

    function buy() public payable {
        require(!paused, "The contract is paused");
        if(block.timestamp >= seedRoundStartTime && block.timestamp <= seedRoundEndTime) {
            // Calculate the number of tokens to mint
            uint256 tokens = msg.value / seedRoundPrice;

            // Mint the tokens
            _mint(msg.sender, tokens);

            // Assign vesting period based on the round of purchase
            vestingPeriod = 12 months;
            vesting[msg.sender] = seedRoundEndTime + vestingPeriod;
            vested[msg.sender] = tokens;
            // Update token price
            seedRoundPrice = privateSaleAPrice;
        }else if(block.timestamp >= privateSaleAStartTime && block.timestamp <= privateSaleAEndTime) {
            // Calculate the number of tokens to mint
            uint256 tokens = msg.value / privateSaleAPrice;

            // Mint the tokens
            _mint(msg.sender, tokens);

            // Assign vesting
            vestingPeriod = 12 months;
            vesting[msg.sender] = privateSaleAEndTime + vestingPeriod;
            vested[msg.sender] = tokens;
            // Update token price
            privateSaleAPrice = privateSaleBPrice;
        }else if(block.timestamp >= privateSaleBStartTime && block.timestamp <= privateSaleBEndTime) {
            // Calculate the number of tokens to mint
            uint256 tokens = msg.value / privateSaleBPrice;

            // Mint the tokens
            _mint(msg.sender, tokens);

            // Assign vesting
            vestingPeriod = 12 months;
            vesting[msg.sender] = privateSaleBEndTime + vestingPeriod;
            vested[msg.sender] = tokens;
        }else{
            revert();
        }
    }

    function claimVested() public {
        // Check if the vesting period has started
        require(block.timestamp >= vesting[msg.sender]);
        // Transfer vested tokens
        _transfer(msg.sender, vested[msg.sender]);
    }

    function() external payable {
        buy();
    }
}
