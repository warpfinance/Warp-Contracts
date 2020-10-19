
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
@notice the WarpVault contract is the main point of interface for a specific LP asset class and an end user in the
Warp lending platform. This contract is responsible for distributing WarpWrapper tokens in exchange for stablecoin assets,
holding and accounting of stablecoins and LP tokens and all associates lending/borrowing calculations for a specific Warp LP asset class.
This contract inherits Ownership and ERC20 functionality from the Open Zeppelin Library as well as Exponential and the InterestRateModel contracts
from the coumpound protocol.
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
  IERC20 public DAI;
  IERC20 public USDC;
  IERC20 public USDT;
  WarpWrapperToken public WDAI;
  WarpWrapperToken public WUSDC;
  WarpWrapperToken public WUSDT;
  UniswapOracleFactoryI public UOF;

  mapping(address => BorrowSnapshot) internal accountBorrowsDAI;
  mapping(address => BorrowSnapshot) internal accountBorrowsUSDC;
  mapping(address => BorrowSnapshot) internal accountBorrowsUSDT;

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
       address _DAI,
       address _USDC,
       address _USDT,
       string _lpName
     ) public {
         transferOwnership(msg.sender);
         lpName = lpName;
         LPtoken = IERC20(_lp);
         DAI = IERC20(_DAI);
         USDC = IERC20(_USDC);
         USDT = IERC20(_USDT);

        WDAI = new WarpWrapperToken(
          _DAI,
          "WDAI",
          "WDAI"
        );

        WUSDC = new WarpWrapperToken(
          _USDC,
          "WUS Dollar Coin",
          "WUSDC"
        );

        WUSDT = new WarpWrapperToken(
          _USDT,
          "WUS Dollar Tether",
          "WUSDT"
        );
     }

/**
@notice Get the underlying balance of an account
@dev This also accrues interest in a transaction
@param _account The address of the account to query
@return The amount of underlying owned by `_account`
*/
    function balanceOfUnderlying(address _account) external returns (uint) {
      Exp memory exchangeRate = Exp({mantissa: exchangeRateCurrent()});
      (MathError mErr, uint balance) = mulScalarTruncate(exchangeRate, LP.balanceOf(_account));
      require(mErr == MathError.NO_ERROR);
       return balance;
     }

/**
@notice getCashPrior is a view funcion that returns the USD balance of all held underlying stablecoin assets
**/
    function getCashPrior() internal view returns (uint){
      uint _daiBal = DAI.balanceOf(address(this));
      uint _usdcBal = USDC.balanceOf(address(this));
      uint _usdtBal = USDT.balanceOf(address(this));
      return _daiBal.add(_usdcBal).add(_usdtBal);
    }

/**
@notice Applies accrued interest to total borrows and reserves
@dev This calculates interest accrued from the last checkpointed block
     up to the current block and writes new checkpoint to storage.
**/
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
         function borrowBalanceCurrent(address account, uint _assetType) public returns (uint) {
           accrueInterest();
           MathError mathErr;
           uint principalTimesIndex;
           uint result;
           if(_assetType == 1){
             //Get borrowBalance and borrowIndex
            BorrowSnapshot storage borrowSnapshot = accountBorrowsDAI[account];
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

           if(_assetType == 2){
             //Get borrowBalance and borrowIndex
            BorrowSnapshot storage borrowSnapshot = accountBorrowsUSDC[account];
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

           if(_assetType == 3){
             //Get borrowBalance and borrowIndex
            BorrowSnapshot storage borrowSnapshot = accountBorrowsUSDT[account];
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

     //struct used by mint to avoid stack too deep errors
     struct MintLocalVars {
       MathError mathErr;
       uint exchangeRateMantissa;
       uint mintTokens;
     }
 /**
@notice lendToWarpVault is used to lend stablecoin assets to a WaprVault
@param _amount is the amount of the asset being lent
@param _assetType is a number value 1-3 representing which asset is being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
  function lendToWarpVault(uint _amount, uint _assetType) public {
    require(_assetType >= 1 && _assetType <= 3);
    //require the asset type is a number 1-3, fails if it is 0 or more than 3
    //declare struct
        MintLocalVars memory vars;
    //retrieve exchange rate
        vars.exchangeRateMantissa = exchangeRateCurrent();
    //We get the current exchange rate and calculate the number of WarpWrapperToken to be minted:
    //mintTokens = _amount / exchangeRate
        (vars.mathErr, vars.mintTokens) = divScalarByExpTruncate(_amount, Exp({mantissa: vars.exchangeRateMantissa}));

    if(_assetType == 1){
      //transfer appropriate amount of DAI from msg.sender to the Vault
      DAI.transferFrom(msg.sender, address(this), _amount);
      //mint appropriate Warp DAI
      WDAI.mint(_account, vars.mintTokens);
    }

    if(_assetType == 2){
      //transfer appropriate amount of USDC from msg.sender to the Vault
      USDC.transferFrom(msg.sender, address(AHR), _amount);
      //mint appropriate Warp USDC
      WUSDC.mint(_account, vars.mintTokens);
    }

    if(_assetType == 3){
      //transfer appropriate amount of USDT from msg.sender to the Vault
      USDT.transferFrom(msg.sender, address(AHR), _amount);
      //mint appropriate Warp USDT
      WUSDT.mint(_account, vars.mintTokens);
    }


  }


    struct RedeemLocalVars {
        MathError mathErr;
        uint exchangeRateMantissa;
        uint redeemAmount;
    }

    /**
@notice redeem allows a user to redeem their Warp Wrapper Token for the appropriate amount of underlying stablecoin asset
@param _amount is the amount of Warp Wrapper token being exchanged
@param _assetType is a number representing which Wrapper type is being redeemed
**/
  function redeem(uint256 _amount, uint256 _assetType) public {
    accrueInterest();
    require( _amount != 0 );
    require(_assetType >= 1 && _assetType <= 3);
//require the asset type is a number 1-3, fails if it is 0 or more than 3
    RedeemLocalVars memory vars;

//get exchange rate
    vars.exchangeRateMantissa = exchangeRateCurrent();
/**
We calculate the exchange rate and the amount of underlying to be redeemed:
redeemAmount = _amount x exchangeRateCurrent
*/
    (vars.mathErr, vars.redeemAmount) = mulScalarTruncate(Exp({mantissa: vars.exchangeRateMantissa}), _amount);
//transfer the calculated amount of underlying asset to the msg.sender

    if(_assetType == 1){
      //Fail if protocol has insufficient cash
        require (DAI.balanceOf(address(this)) >= vars.redeemAmount);
        WDAI.burn(msg.sender, _amount);
        DAI.transfer(msg.sender, vars.redeemAmount);
      }

    if(_assetType == 2){
      //Fail if protocol has insufficient cash
        require (USDC.balanceOf(address(this)) >= vars.redeemAmount);
        WUSDC.burn(msg.sender, _amount);
        USDC.transfer(msg.sender, vars.redeemAmount);
      }

    if(_assetType == 3){
     //Fail if protocol has insufficient cash
      require (USDT.balanceOf(address(this)) >= vars.redeemAmount);
      WUSDT.burn(msg.sender, _amount);
      USDT.transfer(msg.sender, vars.redeemAmount);
    }

  }

  //struct used by borrow function to avoid stack too deep errors
  struct BorrowLocalVars {
      MathError mathErr;
      uint accountBorrows;
      uint accountBorrowsNew;
      uint totalBorrowsNew;
  }

/**
@notice Sender borrows stablecoin assets from the protocol to their own address
@param _borrowAmount The amount of the underlying asset to borrow
*/
  function borrow(uint _borrowAmount, uint _assetType) public {
// _collateral the address of the ALR the user has staked as collateral?
      accrueInterest();

      require(_assetType >= 1 && _assetType <= 3);

//create local vars storage
      BorrowLocalVars memory vars;


       if(_assetType == 1){
         //Fail if protocol has insufficient underlying cash
               require(DAI.balanceOf(address(this)) > _borrowAmount);
         //calculate the new borrower and total borrow balances, failing on overflow:
               vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
         //accountBorrowsNew = accountBorrows + borrowAmount
               (vars.mathErr, vars.accountBorrowsNew) = addUInt(vars.accountBorrows, _borrowAmount);
         //totalBorrowsNew = totalBorrows + borrowAmount
               (vars.mathErr, vars.totalBorrowsNew) = addUInt(totalBorrows, _borrowAmount);
         //We write the previously calculated values into storage
               accountBorrowsDAI[msg.sender].principal = vars.accountBorrowsNew;
               accountBorrowsDAI[msg.sender].interestIndex = borrowIndex;
               totalBorrows = vars.totalBorrowsNew;
         //send them their loaned asset
           DAI.transfer(msg.sender, _borrowAmount);
         }

       if(_assetType == 2){
         //Fail if protocol has insufficient underlying cash
               require(USDC.balanceOf(address(this)) > _borrowAmount);
         //calculate the new borrower and total borrow balances, failing on overflow:
               vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
         //accountBorrowsNew = accountBorrows + borrowAmount
               (vars.mathErr, vars.accountBorrowsNew) = addUInt(vars.accountBorrows, _borrowAmount);
         //totalBorrowsNew = totalBorrows + borrowAmount
               (vars.mathErr, vars.totalBorrowsNew) = addUInt(totalBorrows, _borrowAmount);
         //We write the previously calculated values into storage
               accountBorrowsUSDC[msg.sender].principal = vars.accountBorrowsNew;
               accountBorrowsUSDC[msg.sender].interestIndex = borrowIndex;
               totalBorrows = vars.totalBorrowsNew;
         //send them their loaned asset
           USDC.transfer(msg.sender, _borrowAmount);
         }

       if(_assetType == 3){
         //Fail if protocol has insufficient underlying cash
               require(USDT.balanceOf(address(this)) > _borrowAmount);
         //calculate the new borrower and total borrow balances, failing on overflow:
               vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
         //accountBorrowsNew = accountBorrows + borrowAmount
               (vars.mathErr, vars.accountBorrowsNew) = addUInt(vars.accountBorrows, _borrowAmount);
         //totalBorrowsNew = totalBorrows + borrowAmount
               (vars.mathErr, vars.totalBorrowsNew) = addUInt(totalBorrows, _borrowAmount);
         //We write the previously calculated values into storage
               accountBorrowsUSDT[msg.sender].principal = vars.accountBorrowsNew;
               accountBorrowsUSDT[msg.sender].interestIndex = borrowIndex;
               totalBorrows = vars.totalBorrowsNew;
         //send them their loaned asset
         USDT.transfer(msg.sender, _borrowAmount);
       }

  }

  struct RepayBorrowLocalVars {
      MathError mathErr;
      uint repayAmount;
      uint borrowerIndex;
      uint accountBorrows;
      uint accountBorrowsNew;
      uint totalBorrowsNew;
  }

/**
@notice Sender repays their own borrow
@param repayAmount The amount to repay
*/
  function repayBorrow(uint repayAmount, uint _assetType) public{
    accrueInterest();
          require(_assetType >= 1 && _assetType <= 3);
//create local vars storage
    RepayBorrowLocalVars memory vars;
    if(_assetType == 1){
      //We remember the original borrowerIndex for verification purposes
          vars.borrowerIndex = accountBorrowsDAI[msg.sender].interestIndex;
      //We fetch the amount the borrower owes, with accumulated interest
          vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
      //If repayAmount == 0, repayAmount = accountBorrows
          if (repayAmount == 0) {
              vars.repayAmount = vars.accountBorrows;
          } else {
              vars.repayAmount = repayAmount;
          }
      //We calculate the new borrower and total borrow balances
      //accountBorrowsNew = accountBorrows - actualRepayAmount
          (vars.mathErr, vars.accountBorrowsNew) = subUInt(vars.accountBorrows, vars.repayAmount);
      //totalBorrowsNew = totalBorrows - actualRepayAmount
          (vars.mathErr, vars.totalBorrowsNew) = subUInt(totalBorrows, vars.repayAmount);
          /* We write the previously calculated values into storage */
          accountBorrowsDAI[msg.sender].principal = vars.accountBorrowsNew;
          accountBorrowsDAI[msg.sender].interestIndex = borrowIndex;
          totalBorrows = vars.totalBorrowsNew;
      }

    if(_assetType == 2){
      //We remember the original borrowerIndex for verification purposes
          vars.borrowerIndex = accountBorrowsUSDC[msg.sender].interestIndex;
      //We fetch the amount the borrower owes, with accumulated interest
          vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
      //If repayAmount == 0, repayAmount = accountBorrows
          if (repayAmount == 0) {
              vars.repayAmount = vars.accountBorrows;
          } else {
              vars.repayAmount = repayAmount;
          }
      //We calculate the new borrower and total borrow balances
      //accountBorrowsNew = accountBorrows - actualRepayAmount
          (vars.mathErr, vars.accountBorrowsNew) = subUInt(vars.accountBorrows, vars.repayAmount);
      //totalBorrowsNew = totalBorrows - actualRepayAmount
          (vars.mathErr, vars.totalBorrowsNew) = subUInt(totalBorrows, vars.repayAmount);
          /* We write the previously calculated values into storage */
          accountBorrowsUSDC[msg.sender].principal = vars.accountBorrowsNew;
          accountBorrowsUSDC[msg.sender].interestIndex = borrowIndex;
          totalBorrows = vars.totalBorrowsNew;
      }

    if(_assetType == 3){
      //We remember the original borrowerIndex for verification purposes
          vars.borrowerIndex = accountBorrowsUSDC[msg.sender].interestIndex;
      //We fetch the amount the borrower owes, with accumulated interest
          vars.accountBorrows = borrowBalanceCurrent(msg.sender, _assetType);
      //If repayAmount == 0, repayAmount = accountBorrows
          if (repayAmount == 0) {
              vars.repayAmount = vars.accountBorrows;
          } else {
              vars.repayAmount = repayAmount;
          }
      //We calculate the new borrower and total borrow balances
      //accountBorrowsNew = accountBorrows - actualRepayAmount
          (vars.mathErr, vars.accountBorrowsNew) = subUInt(vars.accountBorrows, vars.repayAmount);
      //totalBorrowsNew = totalBorrows - actualRepayAmount
          (vars.mathErr, vars.totalBorrowsNew) = subUInt(totalBorrows, vars.repayAmount);
          /* We write the previously calculated values into storage */
          accountBorrowsUSDC[msg.sender].principal = vars.accountBorrowsNew;
          accountBorrowsUSDC[msg.sender].interestIndex = borrowIndex;
          totalBorrows = vars.totalBorrowsNew;
    }

  }

  /**
@notice collateralizeLP allows a user to collateralize this contracts associated LP token
@param _amount is the amount of LP being collateralized
**/
   function collateralizeLP(uint _amount) public {
LP.transferFrom(msg.sender, address(this), amount);
WarpControl.trackCollateral(msg.sender, address(Lp), _amount);
   }



}
