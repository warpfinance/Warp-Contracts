pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultSCFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultSCFactoryI contract is used by the Warp Control contract to interface with the WarpVaultSCFactory contract
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

abstract contract WarpVaultSCFactoryI {
    /**
  @notice createNewWarpVaultSC is used to create new WarpVaultSC contract instances
  @param _InterestRate is the address of the InterestRateModel contract created for this Warp Vault
  @param _StableCoin is the address of the stablecoin contract this WarpVault will manage
  @param _warpTeam is the address of the Warp Team used for fees
  @param _initialExchangeRate is the exchange rate mantissa used to determine the initial exchange rate of stablecoin to warp stablecoin
  @param _timelock is a variable representing the number of seconds the timeWizard will prevent withdraws and borrows from a contracts(one week is 605800 seconds)
    **/
    function createNewWarpVaultSC(
        address _InterestRate,
        address _StableCoin,
        address _warpTeam,
        uint256 _initialExchangeRate,
        uint256 _timelock,
        uint256 _reserveFactorMantissa
    ) public virtual returns (address);
}
