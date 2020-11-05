pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "./UniswapLPOracleInstance.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapLPOracleFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapLPOracleFactory contract is designed to produce individual UniswapLPOracleInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract UniswapLPOracleFactory is Ownable {
    using SafeMath for uint256;
    address public usdc_add;
    address public factory;
    IUniswapV2Router02 public uniswapRouter;

    mapping(address => address[]) LPAssetTracker;
    mapping(address => address) instanceTracker;

    /**
@notice constructor function is fired once during contract creation. This constructor initializes uniswapRouter
        as a usable contract instance within the UniswapLPOracleFactory
@param usdcAdd is the address of the ERC20 USDC address
@param _uniFactoryAdd is the address of the uniswap factory contract
**/
    constructor(address usdcAdd, address _uniFactoryAdd, address _uniRouterAddress) public {
        uniswapRouter = IUniswapV2Router02(_uniRouterAddress);
        usdc_add = usdcAdd;
        factory = _uniFactoryAdd;
    }

    /**
  @notice createNewOracle allows the owner of this contract to deploy deploy two new asset oracle contracts
          when a new LP token is whitelisted. this contract will link the address of an LP token contract to
          two seperate oracles that are designed to look up the price of their respective assets in USDC. This
          will allow us to calculate the price of one at LP token token from the prices of their underlying assets

  @param _tokenA is the address of the first token in an Liquidity pair
  @param _tokenB is the address of the second token in a liquidity pair
  @param _lpToken is the address of the token that this oracle will provide a price feed for


  **/
    function createNewOracles(
        address _tokenA,
        address _tokenB,
        address _lpToken
    ) public onlyOwner {
        address _oracle1 = address(
            new UniswapLPOracleInstance(factory, _tokenA, usdc_add)
        );

        address _oracle2 = address(
            new UniswapLPOracleInstance(factory, _tokenB, usdc_add)
        );

        LPAssetTracker[_lpToken] = [_oracle1, _oracle2];
        instanceTracker[_oracle1] = _tokenA;
        instanceTracker[_oracle2] = _tokenB;
    }

    /**
@notice getUnderlyingPrice allows for the price calculation and retrieval of a LP tokens price
@param _lpToken is the address of the LP token  whos asset price is being retrieved
@return returns the price of one LP token
**/
    function getUnderlyingPrice(address _lpToken) public returns (uint256) {
        address[] memory oracleAdds = LPAssetTracker[_lpToken];
        //retreives the oracle contract addresses for each asset that makes up a LP
        UniswapLPOracleInstance oracle1 = UniswapLPOracleInstance(
            oracleAdds[0]
        );
        UniswapLPOracleInstance oracle2 = UniswapLPOracleInstance(
            oracleAdds[1]
        );
        // instantiates both ase usable oracle instances
        uint256 priceAsset1 = oracle1.consult();
        uint256 priceAsset2 = oracle2.consult();
        //retreives the USDC price of one of each asset
        IERC20 lpToken = IERC20(_lpToken);
        //instantiates the LP token as an ERC20 token
        uint256 totalSupplyOfLP = lpToken.totalSupply();
        //retreives the total supply of the LP token
        (uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(
            factory,
            instanceTracker[oracleAdds[0]],
            instanceTracker[oracleAdds[1]]
        );
        //retreives the reserves of each  asset in the liquidity pool
        uint256 reserveAUSDCprice = reserveA.mul(priceAsset1);
        uint256 reserveBUSDCprice = reserveB.mul(priceAsset2);
        //get USDC value for each reserve
        uint256 totalUSDCpriceOfPool = reserveAUSDCprice.add(reserveBUSDCprice);
        //add values together to get total USDC of the pool
        return totalUSDCpriceOfPool / totalSupplyOfLP;
        //return USDC price of the pool divided by totalSupply of its LPs to get price
        //of one LP
    }

    /**
  @notice viewUnderlyingPrice allows for the price retrieval of a LP tokens price
  @param _lpToken is the address of the LP token  whos asset price is being retrieved
  @return returns the price of one LP token
  **/
    function viewUnderlyingPrice(address _lpToken)
        public
        view
        returns (uint256)
    {
        address[] memory oracleAdds = LPAssetTracker[_lpToken];
        //retreives the oracle contract addresses for each asset that makes up a LP
        UniswapLPOracleInstance oracle1 = UniswapLPOracleInstance(
            oracleAdds[0]
        );
        UniswapLPOracleInstance oracle2 = UniswapLPOracleInstance(
            oracleAdds[1]
        );
        // instantiates both ase usable oracle instances
        uint256 priceAsset1 = oracle1.viewPrice();
        uint256 priceAsset2 = oracle2.viewPrice();
        //retreives the USDC price of one of each asset
        IERC20 lpToken = IERC20(_lpToken);
        //instantiates the LP token as an ERC20 token
        uint256 totalSupplyOfLP = lpToken.totalSupply();
        //retreives the total supply of the LP token
        (uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(
            factory,
            instanceTracker[oracleAdds[0]],
            instanceTracker[oracleAdds[1]]
        );
        //retreives the reserves of each  asset in the liquidity pool
        uint256 reserveAUSDCprice = reserveA.mul(priceAsset1);
        uint256 reserveBUSDCprice = reserveB.mul(priceAsset2);
        //get USDC value for each reserve
        uint256 totalUSDCpriceOfPool = reserveAUSDCprice.add(reserveBUSDCprice);
        //add values together to get total USDC of the pool
        return totalUSDCpriceOfPool / totalSupplyOfLP;
        //return USDC price of the pool divided by totalSupply of its LPs to get price
        //of one LP
    }

    /**
@notice getPathForERC20Swap is an internal function used to create a uniswap trade path for two input
        ERC20 tokens using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
**/
    function getPathForERC20Swap(address _tokenA, address _tokenB)
        private
        view
        returns (address[] memory)
    {
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
        uint256 _amountIn,
        uint256 _amountOutMin
    ) external {
        uint256 deadline = block.timestamp + 60;
        uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            getPathForERC20Swap(_tokenA, _tokenB),
            _to,
            deadline
        );
    }
}
