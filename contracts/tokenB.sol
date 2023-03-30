//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract tokenB is ERC20{
    address owner;
    constructor() ERC20("TokenB", "TKB"){
        owner = msg.sender;
        _mint(address(this), 100000000 * (10 **18));
    }

    function withdraw(uint256 _amount) external returns(bool success){
        require(msg.sender == owner, "You're not the owner");
        require(balanceOf(address(this)) >= _amount, "Please try again later");
        success = transfer(msg.sender, _amount);
    }
}