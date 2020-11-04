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
        uint256 _initialExchangeRate,
        string memory _stableCoinName,
        string memory _stableCoinSymbol
    ) public virtual returns (address);
}
