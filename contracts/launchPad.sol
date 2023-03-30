//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract launchPad {
    address owner;

    struct CreatePad{
        string name;
        IERC20 TokenA;
        IERC20 TokenB;
        uint256 startTime;
        uint256 endTime;
        uint256 tokenBQuantity;
        bool exists;
    }

    mapping(address => CreatePad) padOwner;
    mapping(uint256 => mapping(address => CreatePad)) padId;

    constructor(address _owner){
        owner = _owner;
    }

    function createLaunchPad(string memory _name, IERC20 _tokenA, IERC20 _tokenB,uint256 _startTime, uint256 _seconds, uint256 _totalPool) external payable returns(uint256 _id){
        uint256 fee = 0.01 ether;
        require(msg.value == fee, "Amount must be 0.001ETH");
        require(_tokenB.balanceOf(msg.sender) >= _totalPool);
        _tokenB.transferFrom(msg.sender, address(this), _totalPool);
        _id++;
        CreatePad memory pad = padId[_id][msg.sender];
        uint256 startTimeInSeconds = _startTime;
        uint256 timeInSeconds = _seconds;
        pad.name = _name;
        pad.TokenA = _tokenA;
        pad.TokenB = _tokenB;
        pad.startTime = block.timestamp + startTimeInSeconds;
        pad.endTime = pad.startTime + timeInSeconds;
        pad.tokenBQuantity = _totalPool;
        pad.exists = true;
        return _id;
    }

    function deposit(uint256 _id, address _creator, uint256 _amount) external returns(bool success){
        require(padId[_id][_creator].exists == true, "This Campaign does not exist");
        IERC20 tokenA = padId[_id][_creator].TokenA;
        require(tokenA.balanceOf(msg.sender) >= _amount, "Insufficient funds");
        tokenA.transferFrom(msg.sender, address(this), _amount);
    }
}