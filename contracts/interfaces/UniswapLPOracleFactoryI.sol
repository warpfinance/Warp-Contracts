pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapLPOracleFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapLPOracleFactoryI contract an abstract contract the Warp platform uses to interface
    With the UniswapOracleFactory to retrieve token prices.
**/

abstract contract UniswapLPOracleFactoryI {
    /**
@notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
        a new asset is whitelisted
@dev this function is marked as virtual as it is an abstracted function
**/

    function createNewOracles(
        address _tokenA,
        address _tokenB,
        address _lpToken
    ) public virtual;

    function OneUSDC() public virtual view returns (uint256);

    /**
@notice getUnderlyingPrice allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingPrice(address _MMI)
        public
        virtual
        returns (uint256);

    function viewUnderlyingPrice(address _MMI)
        public
        view
        virtual
        returns (uint256);

    function getPriceOfToken(address _token, uint256 _amount) public virtual returns (uint256);
    function viewPriceOfToken(address token, uint256 _amount) public view virtual returns (uint256);

    function transferOwnership(address _newOwner) public virtual;

}
