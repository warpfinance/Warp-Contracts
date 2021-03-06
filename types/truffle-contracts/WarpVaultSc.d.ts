/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface WarpVaultScContract
  extends Truffle.Contract<WarpVaultScInstance> {
  "new"(
    _InterestRate: string,
    _StableCoin: string,
    _warpControl: string,
    _warpTeam: string,
    _initialExchangeRate: number | BN | string,
    _timelock: number | BN | string,
    _reserveFactorMantissa: number | BN | string,
    meta?: Truffle.TransactionDetails
  ): Promise<WarpVaultScInstance>;
}

export interface InterestAccrued {
  name: "InterestAccrued";
  args: {
    accrualBlockNumber: BN;
    borrowIndex: BN;
    totalBorrows: BN;
    totalReserves: BN;
    0: BN;
    1: BN;
    2: BN;
    3: BN;
  };
}

export interface InterestShortCircuit {
  name: "InterestShortCircuit";
  args: {
    _blockNumber: BN;
    0: BN;
  };
}

export interface LoanRepayed {
  name: "LoanRepayed";
  args: {
    _borrower: string;
    _repayAmount: BN;
    remainingPrinciple: BN;
    remainingInterest: BN;
    0: string;
    1: BN;
    2: BN;
    3: BN;
  };
}

export interface ReserveWithdraw {
  name: "ReserveWithdraw";
  args: {
    _amount: BN;
    0: BN;
  };
}

export interface StableCoinLent {
  name: "StableCoinLent";
  args: {
    _lender: string;
    _amountLent: BN;
    _amountOfWarpMinted: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface StableCoinWithdraw {
  name: "StableCoinWithdraw";
  args: {
    _lender: string;
    _amountWithdrawn: BN;
    _amountOfWarpBurnt: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface WarpControlChanged {
  name: "WarpControlChanged";
  args: {
    _newControl: string;
    _oldControl: string;
    0: string;
    1: string;
  };
}

export interface WarpTeamChanged {
  name: "WarpTeamChanged";
  args: {
    _newTeam: string;
    _newControl: string;
    0: string;
    1: string;
  };
}

type AllEvents =
  | InterestAccrued
  | InterestShortCircuit
  | LoanRepayed
  | ReserveWithdraw
  | StableCoinLent
  | StableCoinWithdraw
  | WarpControlChanged
  | WarpTeamChanged;

export interface WarpVaultScInstance extends Truffle.ContractInstance {
  InterestRate(txDetails?: Truffle.TransactionDetails): Promise<string>;

  accountBorrows(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<[BN, BN]>;

  accrualBlockNumber(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  borrowIndex(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  divisor(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  historicalReward(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  percent(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  principalBalance(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  reserveFactorMantissa(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  stablecoin(txDetails?: Truffle.TransactionDetails): Promise<string>;

  timeWizard(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  totalBorrows(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  totalReserves(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  wStableCoin(txDetails?: Truffle.TransactionDetails): Promise<string>;

  warpControl(txDetails?: Truffle.TransactionDetails): Promise<string>;

  warpTeam(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * getSCDecimals allows for easy retrieval of the vaults stablecoin decimals*
   */
  getSCDecimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * getSCAddress allows for the easy retrieval of the vaults stablecoin address*
   */
  getSCAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * this is a protected function that can only be called by the WarpControl contract*
   * upgrade is used when upgrading to a new version of the WarpControl contracts
   */
  updateWarpControl: {
    (_warpControl: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _warpControl: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _warpControl: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _warpControl: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  updateTeam: {
    (_team: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(_team: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      _team: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _team: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * getCashPrior is a view funcion that returns the USD balance of all held underlying stablecoin assets*
   */
  getCashPrior(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * calculateFee is used to calculate the fee earned by the Warp Platform
   * @param _payedAmount is a uint representing the full amount of stablecoin earned as interest*
   */
  calculateFee(
    _payedAmount: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * this is a protected function that can only be called by the warpTeam address*
   * withdrawReserves allows the warp team to withdraw the reserves earned by fees
   * @param _amount is the amount of a stablecoin being withdrawn
   */
  withdrawReserves: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * this is a protected function that can only be called by the WarpControl contract*
   * setNewInterestModel allows for a new interest rate model to be set for this vault
   * @param _newModel is the address of the new interest rate model contract
   */
  setNewInterestModel: {
    (_newModel: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _newModel: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newModel: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newModel: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * updateReserve allows for a new reserv percentage to be set
   * @param _newReserveMantissa is the reserve percentage scaled by 1e18*
   */
  updateReserve: {
    (
      _newReserveMantissa: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _newReserveMantissa: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newReserveMantissa: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newReserveMantissa: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * This calculates interest accrued from the last checkpointed block up to the current block and writes new checkpoint to storage.*
   * Applies accrued interest to total borrows and reserves
   */
  accrueInterest: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * returns last calculated account's borrow balance using the prior borrowIndex
   * @param account The address whose balance should be calculated after updating borrowIndex
   */
  borrowBalancePrior(
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
   * @param account The address whose balance should be calculated after updating borrowIndex
   */
  borrowBalanceCurrent: {
    (account: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(account: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;
    sendTransaction(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns the current per-block borrow interest rate for this cToken
   */
  borrowRatePerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Returns the current per-block supply interest rate for this cToken
   */
  supplyRatePerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Returns the current total borrows plus accrued interest
   */
  totalBorrowsCurrent: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * return the not up-to-date exchange rate
   */
  exchangeRatePrior(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Accrue interest then return the up-to-date exchange rate
   */
  exchangeRateCurrent: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Get cash balance of this cToken in the underlying asset in other contracts
   */
  getCash(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * the user will need to first approve the transfer of the underlying asset*
   * lendToWarpVault is used to lend stablecoin assets to a WaprVault
   * @param _amount is the amount of the asset being lent
   */
  lendToWarpVault: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * redeem allows a user to redeem their Warp Wrapper Token for the appropriate amount of underlying stablecoin asset
   * @param _amount is the amount of StableCoin the user wishes to exchange*
   */
  redeem: {
    (
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * viewAccountBalance is used to view the current balance of an account
   * @param _account is the account whos balance is being viewed*
   */
  viewAccountBalance(
    _account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * viewHistoricalReward is used to view the total gains of an account
   * @param _account is the account whos gains are being viewed*
   */
  viewHistoricalReward(
    _account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Sender borrows stablecoin assets from the protocol to their own address
   * @param _borrowAmount The amount of the underlying asset to borrow
   */
  _borrow: {
    (
      _borrowAmount: number | BN | string,
      _borrower: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _borrowAmount: number | BN | string,
      _borrower: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _borrowAmount: number | BN | string,
      _borrower: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _borrowAmount: number | BN | string,
      _borrower: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Sender repays their own borrow
   * @param _repayAmount The amount to repay
   */
  repayBorrow: {
    (
      _repayAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _repayAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _repayAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _repayAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * this function uses the onlyWarpControl modifier which means it can only be called by the Warp Control contract*
   * repayLiquidatedLoan is a function used by the Warp Control contract to repay a loan on behalf of a liquidator
   * @param _amount is the amount of StableCoin being repayed
   * @param _borrower is the address of the borrower who took out the loan
   * @param _liquidator is the address of the account who is liquidating the loan
   */
  _repayLiquidatedLoan: {
    (
      _borrower: string,
      _liquidator: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _borrower: string,
      _liquidator: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _borrower: string,
      _liquidator: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _borrower: string,
      _liquidator: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    InterestRate(txDetails?: Truffle.TransactionDetails): Promise<string>;

    accountBorrows(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<[BN, BN]>;

    accrualBlockNumber(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    borrowIndex(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    divisor(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    historicalReward(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    percent(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    principalBalance(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    reserveFactorMantissa(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    stablecoin(txDetails?: Truffle.TransactionDetails): Promise<string>;

    timeWizard(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    totalBorrows(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    totalReserves(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    wStableCoin(txDetails?: Truffle.TransactionDetails): Promise<string>;

    warpControl(txDetails?: Truffle.TransactionDetails): Promise<string>;

    warpTeam(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * getSCDecimals allows for easy retrieval of the vaults stablecoin decimals*
     */
    getSCDecimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * getSCAddress allows for the easy retrieval of the vaults stablecoin address*
     */
    getSCAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * this is a protected function that can only be called by the WarpControl contract*
     * upgrade is used when upgrading to a new version of the WarpControl contracts
     */
    updateWarpControl: {
      (_warpControl: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _warpControl: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _warpControl: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _warpControl: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    updateTeam: {
      (_team: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _team: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _team: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _team: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * getCashPrior is a view funcion that returns the USD balance of all held underlying stablecoin assets*
     */
    getCashPrior(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * calculateFee is used to calculate the fee earned by the Warp Platform
     * @param _payedAmount is a uint representing the full amount of stablecoin earned as interest*
     */
    calculateFee(
      _payedAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * this is a protected function that can only be called by the warpTeam address*
     * withdrawReserves allows the warp team to withdraw the reserves earned by fees
     * @param _amount is the amount of a stablecoin being withdrawn
     */
    withdrawReserves: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * this is a protected function that can only be called by the WarpControl contract*
     * setNewInterestModel allows for a new interest rate model to be set for this vault
     * @param _newModel is the address of the new interest rate model contract
     */
    setNewInterestModel: {
      (_newModel: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _newModel: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newModel: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newModel: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * updateReserve allows for a new reserv percentage to be set
     * @param _newReserveMantissa is the reserve percentage scaled by 1e18*
     */
    updateReserve: {
      (
        _newReserveMantissa: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _newReserveMantissa: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newReserveMantissa: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newReserveMantissa: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * This calculates interest accrued from the last checkpointed block up to the current block and writes new checkpoint to storage.*
     * Applies accrued interest to total borrows and reserves
     */
    accrueInterest: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * returns last calculated account's borrow balance using the prior borrowIndex
     * @param account The address whose balance should be calculated after updating borrowIndex
     */
    borrowBalancePrior(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
     * @param account The address whose balance should be calculated after updating borrowIndex
     */
    borrowBalanceCurrent: {
      (account: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns the current per-block borrow interest rate for this cToken
     */
    borrowRatePerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Returns the current per-block supply interest rate for this cToken
     */
    supplyRatePerBlock(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Returns the current total borrows plus accrued interest
     */
    totalBorrowsCurrent: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * return the not up-to-date exchange rate
     */
    exchangeRatePrior(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Accrue interest then return the up-to-date exchange rate
     */
    exchangeRateCurrent: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Get cash balance of this cToken in the underlying asset in other contracts
     */
    getCash(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * the user will need to first approve the transfer of the underlying asset*
     * lendToWarpVault is used to lend stablecoin assets to a WaprVault
     * @param _amount is the amount of the asset being lent
     */
    lendToWarpVault: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * redeem allows a user to redeem their Warp Wrapper Token for the appropriate amount of underlying stablecoin asset
     * @param _amount is the amount of StableCoin the user wishes to exchange*
     */
    redeem: {
      (
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * viewAccountBalance is used to view the current balance of an account
     * @param _account is the account whos balance is being viewed*
     */
    viewAccountBalance(
      _account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * viewHistoricalReward is used to view the total gains of an account
     * @param _account is the account whos gains are being viewed*
     */
    viewHistoricalReward(
      _account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Sender borrows stablecoin assets from the protocol to their own address
     * @param _borrowAmount The amount of the underlying asset to borrow
     */
    _borrow: {
      (
        _borrowAmount: number | BN | string,
        _borrower: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _borrowAmount: number | BN | string,
        _borrower: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _borrowAmount: number | BN | string,
        _borrower: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _borrowAmount: number | BN | string,
        _borrower: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Sender repays their own borrow
     * @param _repayAmount The amount to repay
     */
    repayBorrow: {
      (
        _repayAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _repayAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _repayAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _repayAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * this function uses the onlyWarpControl modifier which means it can only be called by the Warp Control contract*
     * repayLiquidatedLoan is a function used by the Warp Control contract to repay a loan on behalf of a liquidator
     * @param _amount is the amount of StableCoin being repayed
     * @param _borrower is the address of the borrower who took out the loan
     * @param _liquidator is the address of the account who is liquidating the loan
     */
    _repayLiquidatedLoan: {
      (
        _borrower: string,
        _liquidator: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _borrower: string,
        _liquidator: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _borrower: string,
        _liquidator: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _borrower: string,
        _liquidator: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
