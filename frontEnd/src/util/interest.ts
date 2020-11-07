
export const calculateAPYFromRate = (rate: number): number => {
  const blocksPerDay = 4 * 60 * 24;
  const daysPerYear = 365;

  const borrowApy = (((Math.pow((rate * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;

  return borrowApy;
}
