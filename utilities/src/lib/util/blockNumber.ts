import { ethers } from "ethers";

let currentBlockNumber: Maybe<number> = null;

export const getTransactionCallBlockNumber = () => {
  return currentBlockNumber;
}

export const setTransactionCallBlockNumber = (block: Maybe<number>) => {
  currentBlockNumber = block;
}
