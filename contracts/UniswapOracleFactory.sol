pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v2-periphery/contracts/UniswapV2Router02.sol';
import "./UniswapOracleInstance.sol";


////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapOracleFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapOracleFactory contract is designed to produce individual UniswapOracleInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract UniswapOracleFactory is Ownable {
  address public uniswap_router_add = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address public usdc_add;
  address public factory;
  IUniswapV2Router02 public uniswapRouter;

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

/**
@notice constructor function is fired once during contract creation. This constructor initializes uniswapRouter
        as a usable contract instance within the UniswapOracleFactory
@param usdcAdd is the address of the ERC20 USDC address
@param _uniFactoryAdd is the address of the uniswap factory contract
**/
constructor(address usdcAdd, address _uniFactoryAdd) public {
  uniswapRouter = IUniswapV2Router02(uniswap_router_add);
  usdc_add = usdcAdd;
  factory = _uniFactoryAdd;
}

  /**
  @notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
          a new asset is whitelisted
  @param token is the address of the token that this oracle will provide a price feed for
  **/
  function createNewOracle(
    address token
  )
  public
  onlyOwner
  returns(address)
  {

    address _oracle = address(new UniswapOracleInstance (
       factory,
       token,
       usdc_add
    ));
    instanceTracker[token] = _oracle;
    return _oracle;
  }


/**
@notice linkMMI is used to link a MoneyMarketInstance to its oracle in the oracle factory contract
@param _MMI is the address of the MoneyMarketInstance
@param _asset is the address of the MoneyMarketInstancesunderlying asset
**/
  function linkMMI(address _MMI, address _asset) public {
      address oracle = instanceTracker[_asset];
        instanceTracker[_MMI] = oracle;
  }

/**
@notice getUnderlyingPrice allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
  function getUnderlyingPrice(address _MMI) public view returns(uint) {
    UniswapOracleInstance oracle = UniswapOracleInstance(instanceTracker[_MMI]);
    return oracle.consult();
  }

/**
@notice getPathForERC20Swap is an internal function used to create a uniswap trade path for two input
        ERC20 tokens using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
**/
  function getPathForERC20Swap(address _tokenA, address _tokenB) private view returns (address[] memory) {
    address[] memory path = new address[](3);
    path[0] = _tokenA;
    path[1] = uniswapRouter.WETH();
    path[2] = _tokenB;

    return path;
  }

/**
@notice swapERC20 is an external function that swaps one ERC20 token for another
        using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@param _to is the address of the MoneyMarketInstance calling this function
@param _amountIn is the amount of _tokenA being exchanged
@param _amountOutMin is the minimum amount of _tokenB to be received
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
@dev _amountOutMin will need to be atleast enough to cover the cost of collateral liquidation
      (loan amount +i nterest) and its liquidation fee amount.
**/
  function swapERC20(
    address _tokenA,
    address _tokenB,
    address _to,
    uint _amountIn,
    uint _amountOutMin
  ) external {
    uint deadline = block.timestamp + 60;
    uniswapRouter.swapExactTokensForTokens(
      _amountIn,
      _amountOutMin,
      getPathForERC20Swap(_tokenA, _tokenB),
      _to,
      deadline
    );
  }


}
