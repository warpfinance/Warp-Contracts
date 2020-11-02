pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/WarpVaultI.sol";
import "./interfaces/UniswapLPOracleFactoryI.sol";
import "./compound/Exponential.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpControl
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
WarpControl is designed to coordinate Warp Vaults
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract WarpControl is Ownable, Exponential {
    using SafeMath for uint256;

    uint256 public liquidationIncentiveMantissa = 1.5e18; // 1.5
    address public DAI;
    address public USDC;
    address public USDT;

    UniswapLPOracleFactoryI public Oracle; //oracle factory contract interface

    mapping(address => address) public instanceTracker; //maps LP token address to the assets WarpVault
    mapping(address => mapping(address => uint256)) nonCompliant; // tracks user to a market to a time
    mapping(address => mapping(address => uint256)) collateralTracker; //tracks user to a market to an amount collaterlized in that market
    mapping(address => mapping(address => uint256)) lockedCollateralTracker; //tracks user to a market to an amount collaterlized in that market

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
    constructor(
        address _oracle,
        address _DAI,
        address _USDC,
        address _USDT
    ) public {
        Oracle = UniswapLPOracleFactoryI(_oracle);
        DAI = _DAI;
        USDC = _USDC;
        USDT = _USDT;
    }

    /**
@notice createNewVault allows the contract owner to create a new WarpVault contract along with its associated Warp Wrapper Tokens
**/
    function linkNewVault(
        address _WarpVault,
        address _lp,
        address _lpAsset1,
        address _lpAsset2,
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate
    ) public onlyOwner {
        Oracle.createNewOracles(_lpAsset1, _lpAsset2, _lp);

        instanceTracker[_lp] = _WarpVault;

        WarpVaultI WV = WarpVaultI(_WarpVault);

        WV.setUp(
            _baseRatePerYear,
            _multiplierPerYear,
            _jumpMultiplierPerYear,
            _optimal,
            _initialExchangeRate,
            address(Oracle)
        );
    }

    /**
@notice trackCollateralUP is an external function used to track collateral amounts globally as they increase
@param _borrower is the address of the borrower
@param _WarpVault is the address of the Warp Vault where the collateral is stored
@param _amount is the amount of LP being collateralized
**/
    function trackCollateralUp(
        address _borrower,
        address _WarpVault,
        uint256 _amount
    ) external {
        collateralTracker[_borrower][_WarpVault] = collateralTracker[_borrower][_WarpVault]
            .add(_amount);
    }

    /**
 @notice trackCollateralDown is an external function used to track collateral amounts globally as they decrease
 @param _borrower is the address of the borrower
 @param _WarpVault is the address of the Warp Vault where the collateral is stored
 @param _amount is the amount of LP being collateralized
 **/
    function trackCollateralDown(
        address _borrower,
        address _WarpVault,
        uint256 _amount
    ) external {
        collateralTracker[_borrower][_WarpVault] = collateralTracker[_borrower][_WarpVault]
            .sub(_amount);
    }

    /**
 @notice checkCollateral is an external function used to check collateral amounts globally
 @param _borrower is the address of the borrower
 @param _WarpVault is the address of the Warp Vault where the collateral is stored
 **/
    function checkCollateral(address _borrower, address _WarpVault)
        external
        view
        returns (uint256)
    {
        return collateralTracker[_borrower][_WarpVault];
    }

    /**
  @notice lockCollateralUp is an external function used to track locked collateral amounts globally as they increase
  @param _borrower is the address of the borrower
  @param _WarpVault is the address of the Warp Vault where the collateral is stored
  @param _amount is the amount of LP being collateralized
  **/
    function lockCollateralUp(
        address _borrower,
        address _WarpVault,
        uint256 _amount
    ) external {
        lockedCollateralTracker[_borrower][_WarpVault] = lockedCollateralTracker[_borrower][_WarpVault]
            .add(_amount);
    }

    /**
   @notice lockCollateralDown is an external function used to track locked collateral amounts globally as they decrease
   @param _borrower is the address of the borrower
   @param _WarpVault is the address of the Warp Vault where the collateral is stored
   @param _amount is the amount of LP being collateralized
   **/
    function lockCollateralDown(
        address _borrower,
        address _WarpVault,
        uint256 _amount
    ) external {
        lockedCollateralTracker[_borrower][_WarpVault] = lockedCollateralTracker[_borrower][_WarpVault]
            .sub(_amount);
    }

    /**
 @notice checkLockedCollateral is an external function used to check locked collateral amounts globally
 @param _borrower is the address of the borrower
 @param _WarpVault is the address of the Warp Vault where the collateral is stored
 **/
    function checkLockedCollateral(address _borrower, address _WarpVault)
        external
        view
        returns (uint256)
    {
        return lockedCollateralTracker[_borrower][_WarpVault];
    }

    /**
@notice checkCollateralValue is a view function that accepts an account address and an WarpVault contract
        address and returns the USD value of the collateral they have locked.
@param _borrower is the address whos collateral value we are looking up
@param _WarpVault is the address of the _WarpVault token where collateral value is being looked up
 **/
    function checkCollateralValue(address _borrower, address _WarpVault)
        external
        view
        returns (uint256)
    {
        //instantiate the MoneyMakerInstance calling this function
        WarpVaultI WV = WarpVaultI(msg.sender);
        //retreive the address of its asset
        address asset = WV.getAssetAdd();
        //retrieve USD price of this asset
        uint256 priceOfAsset = Oracle.getUnderlyingPrice(asset);
        //retrieve the amount of the asset locked as collateral
        uint256 amountOfAssetCollat = collateralTracker[_borrower][_WarpVault];
        //multiply the amount of collateral by the asset price and return it
        return amountOfAssetCollat.mul(priceOfAsset);
    }

    /**
@notice markAccountNonCompliant is used by a potential liquidator to mark an account as non compliant which starts its 30 minute timer
@param _borrower is the address of the non compliant borrower
@param _WarpVault is the address of the money market instances ALR token the user is non-compliant in
**/
    function markAccountNonCompliant(address _borrower, address _WarpVault)
        public
    {
        //needs to check for account compliance
        require(nonCompliant[_borrower][_WarpVault] == 0);
        nonCompliant[_borrower][_WarpVault] = now;
    }

    //struct used to avoid stack too deep errors
    struct liquidateLocalVar {
        address assetOwed;
        address assetColat;
        uint256 borrowedAmount;
        uint256 collatAmount;
        uint256 borrowedValue;
        uint256 collatValue;
        uint256 halfVal;
        uint256 exchangeRateMantissa; // Note: reverts on error
        uint256 seizeTokens;
    }

    /**
@notice The sender liquidates the borrowers collateral. This function is called on the WarpVault the borrower owes to.
@param borrower The borrower of a Warpvaults LP token to be liquidated
@param repayAmount The amount of the underlying borrowed asset to repay
@param _WarpVaultowed is the address of the WarpVault where the borrower owes asset
@param _WarpVaultcollateralized is the address of the WarpVault where the borrower has collateral
**/

    function liquidateAccount(
        address borrower,
        uint256 repayAmount,
        WarpVaultI _WarpVaultowed,
        WarpVaultI _WarpVaultcollateralized
    ) public {
        //checks if its been nonCompliant for more than a half hour
        require(
            now >= nonCompliant[borrower][address(_WarpVaultowed)].add(1800)
        );
        //create local vars storage
        liquidateLocalVar memory vars;
        //get asset addresses of both WarpVault
        vars.assetOwed = _WarpVaultowed.getAssetAdd();
        vars.assetColat = _WarpVaultcollateralized.getAssetAdd();
        //Read oracle prices for borrowed and collateral markets
        uint256 priceBorrowedMantissa = Oracle.getUnderlyingPrice(
            vars.assetOwed
        );
        uint256 priceCollateralMantissa = Oracle.getUnderlyingPrice(
            vars.assetColat
        );
        require(priceBorrowedMantissa != 0 && priceCollateralMantissa != 0);
        //retrieve asset amounts for each
        vars.borrowedAmount = _WarpVaultowed.borrowBalanceCurrent(borrower, 1);
        vars.borrowedAmount = vars.borrowedAmount.add(
            _WarpVaultowed.borrowBalanceCurrent(borrower, 2)
        );
        vars.borrowedAmount = vars.borrowedAmount.add(
            _WarpVaultowed.borrowBalanceCurrent(borrower, 3)
        );
        vars.collatAmount = collateralTracker[borrower][address(
            _WarpVaultcollateralized
        )];
        //calculate USDC value amounts of each
        vars.borrowedValue = vars.borrowedAmount.mul(priceBorrowedMantissa);
        vars.collatValue = vars.collatAmount.mul(priceCollateralMantissa);
        //divide collateral value in half
        vars.halfVal = vars.collatValue.div(2);
        //add 1/2 the collateral value to the total collateral value for 150% colleral value
        vars.collatValue = vars.collatValue.add(vars.halfVal);
        //require the value of whats been borrowed to be lower than 150% of the collaterals value
        if (vars.collatValue >= vars.borrowedValue) {
            //Get the exchange rate and calculate the number of collateral tokens to seize:
            vars.exchangeRateMantissa = _WarpVaultowed.exchangeRateCurrent(); // Note: reverts on error
            Exp memory numerator;
            Exp memory denominator;
            Exp memory ratio;
            MathError mathErr;
            //numerator = liquidationIncentive * priceBorrowed
            (mathErr, numerator) = mulExp(
                liquidationIncentiveMantissa,
                priceBorrowedMantissa
            );
            require(mathErr == MathError.NO_ERROR);
            //denominator = priceCollateral * exchangeRate
            (mathErr, denominator) = mulExp(
                priceCollateralMantissa,
                vars.exchangeRateMantissa
            );
            require(mathErr == MathError.NO_ERROR);
            //ratio = (liquidationIncentive * priceBorrowed) / (priceCollateral * exchangeRate)
            (mathErr, ratio) = divExp(numerator, denominator);
            require(mathErr == MathError.NO_ERROR);
            //seizeTokens = actualRepayAmount * (liquidationIncentive * priceBorrowed) / (priceCollateral * exchangeRate)
            (mathErr, vars.seizeTokens) = mulScalarTruncate(ratio, repayAmount);
            require(mathErr == MathError.NO_ERROR);
            /**
this function calls the WarpVault where the borrower has collateral staked and has it swap
its underlying asset on uniswap for the underlying asset borrowed
**/
        }
        //reset accounts compliant timer
        nonCompliant[borrower][address(_WarpVaultowed)] = 0; //resets borrowers compliance timer
    }
}
