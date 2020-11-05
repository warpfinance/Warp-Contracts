pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultSCFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultSCFactoryI contract is designed to produce individual WarpVaultLP contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

abstract contract WarpVaultSCFactoryI {
    function createNewWarpVaultSC(
        address _InterestRate,
        address _StableCoin,
        uint256 _initialExchangeRate
    ) public virtual returns (address);
}
