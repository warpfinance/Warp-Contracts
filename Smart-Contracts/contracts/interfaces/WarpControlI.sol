pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultI contract an abstract contract the MoneyMarketFactory uses to interface
    eith the UniswapOracleFactory. This is necissary as the OpenZeppelin and Uniswap libraries cause a
    truffle compiler error due when imported into the same contract due to the use of two seperate
    SafeMath instances
**/

abstract contract WarpControlI {
    function getMaxWithdrawAllowed(address account, address lpToken) public virtual returns (uint256);
}
