pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultSCI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultSCI contract an abstract contract the WarpControl contract uses to interface
    with a WarpVaultSC contract.
**/

abstract contract WarpVaultSCI {

      uint256 public totalReserves;
    /**
    @notice Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
    @param account The address whose balance should be calculated after updating borrowIndex
    @return The calculated balance
    **/
    function borrowBalanceCurrent(address account)
        public
        virtual
        returns (uint256);

    /**
    @notice returns last calculated account's borrow balance using the prior borrowIndex
    @param account The address whose balance should be calculated after updating borrowIndex
    @return The calculated balance
    **/
    function borrowBalancePrior(address account)
        public
        view
        virtual
        returns (uint256);

    /**
     @notice Accrue interest then return the up-to-date exchange rate
     @return Calculated exchange rate scaled by 1e18
     **/
    function exchangeRateCurrent() public virtual returns (uint256);

    /**
    @notice Sender borrows stablecoin assets from the protocol to their own address
    @param _borrowAmount The amount of the underlying asset to borrow
    @param _borrower The borrower
    */
    function _borrow(uint256 _borrowAmount, address _borrower) external virtual;

    /**
    @notice repayLiquidatedLoan is a function used by the Warp Control contract to repay a loan on behalf of a liquidator
    @param _borrower is the address of the borrower who took out the loan
    @param _liquidator is the address of the account who is liquidating the loan
    @param _amount is the amount of StableCoin being repayed
    @dev this function uses the onlyWC modifier which means it can only be called by the Warp Control contract
    **/
    function _repayLiquidatedLoan(
        address _borrower,
        address _liquidator,
        uint256 _amount
    ) public virtual;

    function setNewInterestModel(address _newModel) public virtual;


    function transferOwnership(address _newOwner) public virtual;

    function getSCDecimals() public view virtual returns(uint8);
    function getSCAddress() public view virtual returns(address);

    function upgrade(address _warpControl) public virtual;

}
