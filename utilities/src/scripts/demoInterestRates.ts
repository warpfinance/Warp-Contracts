
import { BigNumber } from 'bignumber.js'

const blocksPerYear = new BigNumber(2102400);
const baseRatePerYear = new BigNumber("20000000000000000");
const multiplierPerYear = new BigNumber("22222222222200000");
const jumpMultiplierPerYear = new BigNumber("40");
const kink_ = new BigNumber("900000000000000000");
const baseRatePerBlock = baseRatePerYear.div(blocksPerYear);
const multiplierPerBlock = (multiplierPerYear.times(1e18)).div(blocksPerYear.times(kink_));
const jumpMultiplierPerBlock = jumpMultiplierPerYear.div(blocksPerYear);
const kink = kink_;

const _supplyAmount = 100;
const _borrowAmount = 1000;
const testSupplyAmount = (new BigNumber(_supplyAmount)).times(1e18);
const testBorrowAmount = (new BigNumber(_borrowAmount)).times(1e18);
const testReserves = new BigNumber(0);
const testReserveFactor = new BigNumber("50000000000000000");

const utilizationRate = (cash: BigNumber, borrows: BigNumber, reserves: BigNumber) => {
  if (borrows.eq(0)) {
    return new BigNumber(0);
  }

  return borrows.times(1e18).div(cash.plus(borrows).minus(reserves));
}

const getBorrowRate = (cash: BigNumber, borrows: BigNumber, reserves: BigNumber) => {
  const util = utilizationRate(cash, borrows, reserves);

  if (util <= kink) {
      return util.times(multiplierPerBlock).div(1e18).plus(baseRatePerBlock);
  } else {
      const normalRate = kink.times(multiplierPerBlock).div(1e18).plus(baseRatePerBlock);
      const excessUtil = util.minus(kink);
      return excessUtil.times(jumpMultiplierPerBlock).div(1e18).plus(normalRate);
  }
}

const getSupplyRate = (cash: BigNumber, borrows: BigNumber, reserves: BigNumber, reserveFactorMantissa: BigNumber) => {
  const oneMinusReserveFactor = new BigNumber(1e18).minus(reserveFactorMantissa);
  const borrowRate = getBorrowRate(cash, borrows, reserves);
  const rateToPool = borrowRate.times(oneMinusReserveFactor).div(1e18);
  return utilizationRate(cash, borrows, reserves).times(rateToPool).div(1e18);
}



const getRates = (supplyRatePerBlock: number, borrowRatePerBlock: number) => {
  const ethMantissa = 1e18;
  const blocksPerDay = 4 * 60 * 24;
  const daysPerYear = 365;
  const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;
  const borrowApy = (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;
  console.log(`Supply APY for ETH ${supplyApy} %`);
  console.log(`Borrow APY for ETH ${borrowApy} %`);
}



getRates(getSupplyRate(testSupplyAmount, testBorrowAmount, testReserves, testReserveFactor).toNumber(), getBorrowRate(testSupplyAmount, testBorrowAmount, testReserves).toNumber());
