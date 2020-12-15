import { BigNumber, ethers, utils } from 'ethers';
import moment from 'moment';
import { getBlockByTime } from '.';

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(utils.formatUnits(value, decimals)).toFixed(precision);

export const parseBigNumber = (value: BigNumber, decimals = 18): number => {
  return Number(utils.formatUnits(value, decimals));
};

export const convertNumberToBigNumber = (amount: number | string, decimals: number) => {
  if (typeof amount === 'number') {
    amount = amount.toFixed(decimals);
  }
  const bigParsedAmount = utils.parseUnits(amount, decimals);
  return bigParsedAmount;
};

export const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
};

export const getBlockNearTime = async (provider: ethers.providers.Provider, time: number) => {
  const min = moment(time).subtract(30, 'seconds').unix();
  const max = moment(time).add(30, 'seconds').unix();
  const block = await getBlockByTime(provider, moment(time).unix(), min, max);
  return block;
};
