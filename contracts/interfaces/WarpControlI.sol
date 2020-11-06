pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpControlI contract is an abstract contract used by individual WarpVault contracts to call the
  maxWithdrawAllowed function on the WarpControl contract
**/

abstract contract WarpControlI {
    function getMaxWithdrawAllowed(address account, address lpToken) public virtual returns (uint256);
    function viewPriceOfCollateral(address lpToken) public virtual view returns (uint256);
}
