pragma solidity ^0.8.7;

import "https://github.com/polygon-network/contracts/blob/main/contracts/math/SafeMath.sol";

contract O2PToken {
    using SafeMath for uint256;

    // Variables for token name, symbol and decimal
    string public name = "O2P Token";
    string public symbol = "O2P";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // Mapping for balance of each address
    mapping(address => uint256) public balanceOf;
    // Mapping for vesting of each address
    mapping(address => uint256) public vestingOf;
    // Mapping for unlocked vesting of each address
    mapping(address => uint256) public unlockedVestingOf;
    // Events for transfer and vesting
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Vesting(address indexed from, address indexed to, uint256 value);

    constructor() public {
        totalSupply = 100000000e18;
        balanceOf[msg.sender] = totalSupply;
    }
    /*
    function to allocate vesting tokens to an address,
    _to: the address that will receive the vesting tokens
    _value: the amount of vesting tokens
    _start: the start time of vesting
    _cliff: the duration of the cliff
    _duration: the duration of the vesting period
    */
    function allocateVesting(address _to, uint256 _value, uint256 _start, uint256 _cliff, uint256 _duration) public {
        require(_to != address(0));
        require(_value > 0);
        require(_cliff <= _duration);
        vestingOf[_to] = _value;
        emit Vesting(address(0), _to, _value);
    }
    /*
    function to release vesting tokens to an address,
    _to: the address that will receive the vesting tokens
    */
    function releaseVesting(address _to) public {
        require(vestingOf[_to] > 0);
        require(unlockedVestingOf[_to] < vestingOf[_to]);
        require(block.timestamp >= _start + _cliff);
        require(block.timestamp <= _start + _duration);
        uint256 released = (block.timestamp - _start - _cliff) * vestingOf[_to] / _duration;
        released = released.min(vestingOf[_to].sub(unlockedVestingOf[_to]));
        balanceOf[_to] = balanceOf[_to].add(released);
        unlockedVestingOf[_to] = unlockedVestingOf[_to].add(released);
        emit Transfer(address(0), _to, released);
    }
    // function to transfer tokens
        function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value && value > 0);
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}
