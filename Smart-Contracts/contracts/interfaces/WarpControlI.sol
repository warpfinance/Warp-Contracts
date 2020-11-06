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
    /**
      @notice Figures out how much of a given LP token an account is allowed to withdraw
      @param _account is the address of the account being looked up
      @param _lpToken is the address of the LP token being looked up
       **/
    function maxWithdrawAllowed(address account, address lpToken)
        public
        virtual
        returns (uint256);
}
