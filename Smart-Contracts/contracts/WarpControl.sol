pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WarpVault.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./compound/JumpRateModelV2.sol";
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

  using SafeMath for uint;

  uint public instanceCount;//tracks the number of instances
  uint public liquidationIncentiveMantissa = 1.5e18; // 1.5

  UniswapOracleFactoryI public Oracle;//oracle factory contract interface

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets WarpVault
  mapping(address => address) public oracleTracker; //maps a  oracle to its WarpVault address
  mapping(address => mapping(address => uint)) nonCompliant;// tracks user to a market to a time
  mapping(address => mapping(address => uint)) collateralTracker; //tracks user to a market to an amount collaterlized in that market


/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
constructor ( address _oracle) public {
  Oracle = UniswapOracleFactoryI(_oracle);
}



/**
@notice trackCollateral is an external function used  to track collateral amounts globally
@param _borrower is the address of the borrower
@param _WarpVault is the address of the Warp Vault where the collateral is stored
@param _amount is the amount of LP being collateralized
**/
 function trackCollateral(address _borrower, address _WarpVault, uint _amount) external {
   collateralTracker[_borrower][_WarpVault] = _amount;
 }

 /**
@notice checkCollateralValue is a view function that accepts an account address and an WarpVault contract
        address and returns the USD value of the collateral they have locked.
@param _borrower is the address whos collateral value we are looking up
@param _WarpVault is the address of the _WarpVault token where collateral value is being looked up
 **/
 function checkCollateralValue(address _borrower, address _WarpVault) external view  returns(uint) {
//instantiate the MoneyMakerInstance calling this function
   WarpVault WV = WarpVault(msg.sender);
//retreive the address of its asset
   address asset = WV.getAssetAdd();
//retrieve USD price of this asset
   uint priceOfAsset = Oracle.getUnderlyingPrice(asset);
//retrieve the amount of the asset locked as collateral
   uint amountOfAssetCollat = collateralTracker[_borrower][_WarpVault];
//multiply the amount of collateral by the asset price and return it
   return amountOfAssetCollat.mul(priceOfAsset);
 }

/**
@notice markAccountNonCompliant is used by a potential liquidator to mark an account as non compliant which starts its 30 minute timer
@param _borrower is the address of the non compliant borrower
@param _WarpVault is the address of the money market instances ALR token the user is non-compliant in
**/
  function markAccountNonCompliant(address _borrower, address _WarpVault) public {
    //needs to check for account compliance
    require(nonCompliant[_borrower][_WarpVault] == 0);
    nonCompliant[_borrower][_WarpVault] = now;
  }
//struct used to avoid stack too deep errors
  struct liquidateLocalVar {
      address assetOwed;
      address assetColat;
      uint borrowedAmount;
      uint collatAmount;
      uint borrowedValue;
      uint collatValue;
      uint halfVal;
      uint exchangeRateMantissa; // Note: reverts on error
      uint seizeTokens;
  }

/**
@notice The sender liquidates the borrowers collateral. This function is called on the WarpVault the borrower owes to.
@param borrower The borrower of a Warpvaults LP token to be liquidated
@param repayAmount The amount of the underlying borrowed asset to repay
@param _WarpVaultowed is the address of the WarpVault where the borrower owes asset
@param _WarpVaultcollateralized is the address of the WarpVault where the borrower has collateral

*/
  function liquidateAccount(address borrower, uint repayAmount, WarpVault _WarpVaultowed, WarpVault _WarpVaultcollateralized) public {
//checks if its been nonCompliant for more than a half hour
    require(now >= nonCompliant[borrower][address(_WarpVault)].add(1800));
    //create local vars storage
        liquidateLocalVar memory vars;
//get asset addresses of both WarpVault
     vars.assetOwed = _WarpVaultowed.getAssetAdd();
     vars.assetColat = _WarpVaultcollateralized.getAssetAdd();
//Read oracle prices for borrowed and collateral markets
    uint priceBorrowedMantissa = Oracle.getUnderlyingPrice(vars.assetOwed);
    uint priceCollateralMantissa = Oracle.getUnderlyingPrice(vars.assetColat);
    require(priceBorrowedMantissa != 0 && priceCollateralMantissa != 0);
//retrieve asset amounts for each
    vars.borrowedAmount = _WarpVaultowed.borrowBalanceCurrent(borrower);
    vars.collatAmount = collateralTracker[borrower][address(_WarpVaultcollateralized)];
//calculate USDC value amounts of each
    vars.borrowedValue = vars.borrowedAmount.mul(priceBorrowedMantissa);
    vars.collatValue = vars.collatAmount.mul(priceCollateralMantissa);
//divide collateral value in half
    vars.halfVal = vars.collatValue.div(2);
//add 1/2 the collateral value to the total collateral value for 150% colleral value
    vars.collatValue = vars.collatValue.add(vars.halfVal);
//require the value of whats been borrowed to be lower than 150% of the collaterals value
    if (vars.collatValue >= vars.borrowedValue){
//Get the exchange rate and calculate the number of collateral tokens to seize:
     vars.exchangeRateMantissa = _WarpVaultowed.exchangeRateCurrent(); // Note: reverts on error
    Exp memory numerator;
    Exp memory denominator;
    Exp memory ratio;
    MathError mathErr;
//numerator = liquidationIncentive * priceBorrowed
    (mathErr, numerator) = mulExp(liquidationIncentiveMantissa, priceBorrowedMantissa);
    require(mathErr == MathError.NO_ERROR);
//denominator = priceCollateral * exchangeRate
    (mathErr, denominator) = mulExp(priceCollateralMantissa, vars.exchangeRateMantissa);
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
    _WarpVaultcollateralized._liquidateFor(vars.assetOwed, address(_WarpVaultowed), vars.seizeTokens, repayAmount);
    }
  //reset accounts compliant timer
  nonCompliant[borrower][address(_WarpVaultowed)] = 0;//resets borrowers compliance timer
  }



}
