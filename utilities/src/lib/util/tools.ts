import { BigNumber, utils } from "ethers"

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(utils.formatUnits(value, decimals)).toFixed(precision)

export const parseBigNumber = (value: BigNumber, decimals = 18): number => {
  return Number(utils.formatUnits(value, decimals));
}

export const convertNumberToBigNumber = (amount: number | string, decimals: number) => {
  if (typeof amount === "number") {
    amount = amount.toFixed(decimals);
  }
  const bigParsedAmount = utils.parseUnits(amount, decimals);
  return bigParsedAmount;
}