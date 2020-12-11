pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultLPI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultLPI contract an abstract contract the WarpControl contract uses to interface
    with a WarpVaultLP contract.
**/

abstract contract WarpVaultLPI {
    /**
    @notice getAssetAdd allows for easy retrieval of a WarpVaults LP token Adress
    **/
    function getAssetAdd() public view virtual returns (address);

    /**
    @notice collateralOfAccount is a view function to retreive an accounts collateralized LP amount
    @param _account is the address of the account being looked up
    **/

    function collateralOfAccount(address _account)
        public
        view
        virtual
        returns (uint256);

    /**
    @notice _liquidateAccount is a function to liquidate the LP tokens of the input account
    @param _account is the address of the account being liquidated
    @param _liquidator is the address of the account doing the liquidating who receives the liquidated LP's
    @dev this function uses the onlyWC modifier meaning that only the Warp Control contract can call it
    **/
    function _liquidateAccount(address _account, address _liquidator)
        public
        virtual;

    function updateWarpControl(address _warpControl) public virtual;

}
