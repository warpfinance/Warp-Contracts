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

abstract contract WarpVaultLPI {
    function getAssetAdd() public view virtual returns (address);

    function withdrawLP(uint256 _amount) public virtual;

    function collateralLPbalanceOf(address _account)
        public
        view
        virtual
        returns (uint256);

    function lockedWLPbalanceOf(address _account, address _lpVaultItsLockedIn)
        public
        view
        virtual
        returns (uint256);

    function unlockLP(
        address _account,
        address _lpVaultItsLockedIn,
        uint256 _amount
    ) public virtual;
}
