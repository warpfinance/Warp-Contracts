
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./compound/Exponential.sol";
import "./compound/InterestRateModel.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./WarpWrapperToken.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVault
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the WarpWrapperToken contract is designed  as a token Wrapper to represent ownership of stablecoins added to a specific
        WarpVault. This contract inherits Ownership and ERC20 functionality from the Open Zeppelin Library.
**/
contract WarpVault is Ownable {
  uint public lockTime;
  uint internal initialExchangeRateMantissa;
  uint public reserveFactorMantissa;
  uint public accrualBlockNumber;
  uint public borrowIndex;
  uint public totalBorrows;
  uint public totalReserves;
  uint internal constant borrowRateMaxMantissa = 0.0005e16;
  uint internal constant reserveFactorMaxMantissa = 1e18;
  string public lpName;

  IERC20 public LPtoken;
  WarpWrapperToken public WDAI;
  WarpWrapperToken public WUSDC;
  WarpWrapperToken public WUSDT;
  UniswapOracleFactoryI public UOF;

  mapping(address => BorrowSnapshot) internal accountBorrows;

/**
@notice struct for borrow balance information
@member principal Total balance (with accrued interest), after applying the most recent balance-changing action
@member interestIndex Global borrowIndex as of the most recent balance-changing action
*/
    struct BorrowSnapshot {
        uint principal;
        uint interestIndex;
    }

/**
@notice constructor sets up token names and symbols for the WarpWrapperToken
@param _lp is the address of the lp token a specific Warp vault will represent
@param _lpName is the name of the lp token
@dev this function instantiates the lp token as a useable object and generates three WarpWrapperToken contracts to represent
      each type of stable coin this vault can hold. this also instantiates each of these contracts as a usable object in this contract giving
      this contract the ability to call their mint and burn functions.
**/
     constructor(
       address _lp,
       string _lpName
     ) public {
         transferOwnership(msg.sender);
         lpName = lpName;
         LPtoken = LPtoken(_lp);

        WDAI = new WarpWrapperToken(
          _lp,
          "WDAI",
          "WDAI"
        );

        WUSDC = new WarpWrapperToken(
          _lp,
          "WUS Dollar Coin",
          "WUSDC"
        );

        WUSDT = new WarpWrapperToken(
          _lp,
          "WUS Dollar Tether",
          "WUSDT"
        );
     }

     /**
     @notice Get the underlying balance of the `owners`
     @dev This also accrues interest in a transaction
     @param owner The address of the account to query
     @return The amount of underlying owned by `owner`
     */
         function balanceOfUnderlying(address owner) external returns (uint) {
             Exp memory exchangeRate = Exp({mantissa: exchangeRateCurrent()});
             (MathError mErr, uint balance) = mulScalarTruncate(exchangeRate, balanceOf(owner));
             require(mErr == MathError.NO_ERROR);
             return balance;
         }

     /**
     @notice getCashPrior is a view funcion that returns and ART's balance of its underlying asset
     **/
         function getCashPrior() internal view returns (uint){
           return asset.balanceOf(address(this));
         }

     /**
     @notice Applies accrued interest to total borrows and reserves
     @dev This calculates interest accrued from the last checkpointed block
         up to the current block and writes new checkpoint to storage.
     */
         function accrueInterest() public {
     //Remember the initial block number
           uint currentBlockNumber = getBlockNumber();
           uint accrualBlockNumberPrior = accrualBlockNumber;

     //Short-circuit accumulating 0 interest
           require(accrualBlockNumberPrior != currentBlockNumber);

     //Read the previous values out of storage
           uint cashPrior = getCashPrior();
           uint borrowsPrior = totalBorrows;
           uint reservesPrior = totalReserves;
           uint borrowIndexPrior = borrowIndex;

     //Calculate the current borrow interest rate
           uint borrowRateMantissa = interestRateModel.getBorrowRate(cashPrior, borrowsPrior, reservesPrior);
           require(borrowRateMantissa <= borrowRateMaxMantissa);

     //Calculate the number of blocks elapsed since the last accrual
           (MathError mathErr, uint blockDelta) = subUInt(currentBlockNumber, accrualBlockNumberPrior);
           require(mathErr == MathError.NO_ERROR);

     //Calculate the interest accumulated into borrows and reserves and the new index:
           Exp memory simpleInterestFactor;
           uint interestAccumulated;
           uint totalBorrowsNew;
           uint totalReservesNew;
           uint borrowIndexNew;
     //simpleInterestFactor = borrowRate * blockDelta
           (mathErr, simpleInterestFactor) = mulScalar(Exp({mantissa: borrowRateMantissa}), blockDelta);
           require(mathErr == MathError.NO_ERROR);
     //interestAccumulated = simpleInterestFactor * totalBorrows
           (mathErr, interestAccumulated) = mulScalarTruncate(simpleInterestFactor, borrowsPrior);
           require(mathErr == MathError.NO_ERROR);
     //totalBorrowsNew = interestAccumulated + totalBorrows
           (mathErr, totalBorrowsNew) = addUInt(interestAccumulated, borrowsPrior);
           require(mathErr == MathError.NO_ERROR);
     //totalReservesNew = interestAccumulated * reserveFactor + totalReserves
           (mathErr, totalReservesNew) = mulScalarTruncateAddUInt(Exp({mantissa: reserveFactorMantissa}), interestAccumulated, reservesPrior);
           require(mathErr != MathError.NO_ERROR);
     //borrowIndexNew = simpleInterestFactor * borrowIndex + borrowIndex
           (mathErr, borrowIndexNew) = mulScalarTruncateAddUInt(simpleInterestFactor, borrowIndexPrior, borrowIndexPrior);
           require(mathErr != MathError.NO_ERROR);

     //Write the previously calculated values into storage
           accrualBlockNumber = currentBlockNumber;
           borrowIndex = borrowIndexNew;
           totalBorrows = totalBorrowsNew;
           totalReserves = totalReservesNew;
         }


     /**
     @notice Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
     @param account The address whose balance should be calculated after updating borrowIndex
     @return The calculated balance
     **/
         function borrowBalanceCurrent(address account) public returns (uint) {
           accrueInterest();
           MathError mathErr;
           uint principalTimesIndex;
           uint result;

     //Get borrowBalance and borrowIndex
           BorrowSnapshot storage borrowSnapshot = accountBorrows[account];

     //If borrowBalance = 0 then borrowIndex is likely also 0.
     //Rather than failing the calculation with a division by 0, we immediately return 0 in this case.
           if (borrowSnapshot.principal == 0) {
             return (0);
           }

     //Calculate new borrow balance using the interest index:
     //recentBorrowBalance = borrower.borrowBalance * market.borrowIndex / borrower.borrowIndex
           (mathErr, principalTimesIndex) = mulUInt(borrowSnapshot.principal, borrowIndex);
           if (mathErr != MathError.NO_ERROR) {
             return (0);
           }

           (mathErr, result) = divUInt(principalTimesIndex, borrowSnapshot.interestIndex);
           if (mathErr != MathError.NO_ERROR) {
             return (0);
           }

           return (result);
         }

     /**
     @notice Get a snapshot of the account's balances, and the cached exchange rate
     @dev This is used to perform liquidity checks.
     @param account Address of the account to snapshot
     @return (token balance, borrow balance, exchange rate mantissa)
     **/
           function getAccountSnapshot(address account) external returns ( uint, uint, uint) {
               uint tokenBalance = balanceOf(account);
               uint borrowBalance = borrowBalanceCurrent(account);
               uint exchangeRateMantissa = exchangeRateCurrent();
             return ( tokenBalance, borrowBalance, exchangeRateMantissa);
           }

     /**
     @notice getBlockNumber allows for easy retrieval of block number
     **/
           function getBlockNumber() internal view returns (uint) {
               return block.number;
           }

     /**
     @notice Returns the current per-block borrow interest rate for this cToken
     @return The borrow interest rate per block, scaled by 1e18
     **/
           function borrowRatePerBlock() external view returns (uint) {
               return interestRateModel.getBorrowRate(getCashPrior(), totalBorrows, totalReserves);
           }

     /**
     @notice Returns the current per-block supply interest rate for this cToken
     @return The supply interest rate per block, scaled by 1e18
     **/
           function supplyRatePerBlock() external view returns (uint) {
               return interestRateModel.getSupplyRate(getCashPrior(), totalBorrows, totalReserves, reserveFactorMantissa);
           }

     /**
     @notice Returns the current total borrows plus accrued interest
     @return The total borrows with interest
     **/
           function totalBorrowsCurrent() external  returns (uint) {
               accrueInterest();
               return totalBorrows;
           }

     /**
     @notice Accrue interest then return the up-to-date exchange rate
     @return Calculated exchange rate scaled by 1e18
     **/
           function exchangeRateCurrent() public  returns (uint) {
               accrueInterest();
               if (totalSupply() == 0) {
     //If there are no tokens minted: exchangeRate = initialExchangeRate
                 return initialExchangeRateMantissa;
               } else {
     //Otherwise: exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
                 uint totalCash = getCashPrior();//get contract asset balance
                 uint cashPlusBorrowsMinusReserves;
                 Exp memory exchangeRate;
                 MathError mathErr;
     //calculate total value held by contract plus owed to contract
                 (mathErr, cashPlusBorrowsMinusReserves) = addThenSubUInt(totalCash, totalBorrows, totalReserves);
                 require(mathErr == MathError.NO_ERROR);
     //calculate exchange rate
                 (mathErr, exchangeRate) = getExp(cashPlusBorrowsMinusReserves, totalSupply());
                 require(mathErr != MathError.NO_ERROR);
                 return (exchangeRate.mantissa);
               }
           }



     /**
     @notice Get cash balance of this cToken in the underlying asset in other contracts
     @return The quantity of underlying asset owned by this contract
     **/
           function getCash() external view returns (uint) {
               return getCashPrior();
           }


}
