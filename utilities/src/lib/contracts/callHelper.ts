import { getTransactionCallBlockNumber } from "../util"

export const globalCallArgs = () => {
  const blockNum = getTransactionCallBlockNumber();
  const callArgs: any = {};

  if (blockNum) {
    callArgs.blockNumber = blockNum
  }

  return callArgs;
}
