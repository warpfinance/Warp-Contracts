/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface WarpControlIContract
  extends Truffle.Contract<WarpControlIInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<WarpControlIInstance>;
}

type AllEvents = never;

export interface WarpControlIInstance extends Truffle.ContractInstance {
  DAI(txDetails?: Truffle.TransactionDetails): Promise<string>;

  USDC(txDetails?: Truffle.TransactionDetails): Promise<string>;

  USDT(txDetails?: Truffle.TransactionDetails): Promise<string>;

  unlockColateral: {
    (
      _borrower: string,
      _redeemer: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _borrower: string,
      _redeemer: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _borrower: string,
      _redeemer: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _borrower: string,
      _redeemer: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  lockCollateralDown: {
    (
      _borrower: string,
      _redeemer: string,
      _WarpVault: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _borrower: string,
      _redeemer: string,
      _WarpVault: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _borrower: string,
      _redeemer: string,
      _WarpVault: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _borrower: string,
      _redeemer: string,
      _WarpVault: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  checkAvailibleCollateralValue(
    _borrower: string,
    _WarpVault: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  checkTotalAvailableCollateralValue(
    _account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  methods: {
    DAI(txDetails?: Truffle.TransactionDetails): Promise<string>;

    USDC(txDetails?: Truffle.TransactionDetails): Promise<string>;

    USDT(txDetails?: Truffle.TransactionDetails): Promise<string>;

    unlockColateral: {
      (
        _borrower: string,
        _redeemer: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _borrower: string,
        _redeemer: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _borrower: string,
        _redeemer: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _borrower: string,
        _redeemer: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    lockCollateralDown: {
      (
        _borrower: string,
        _redeemer: string,
        _WarpVault: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _borrower: string,
        _redeemer: string,
        _WarpVault: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _borrower: string,
        _redeemer: string,
        _WarpVault: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _borrower: string,
        _redeemer: string,
        _WarpVault: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    checkAvailibleCollateralValue(
      _borrower: string,
      _WarpVault: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    checkTotalAvailableCollateralValue(
      _account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
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
