import { BigNumber, utils  } from 'ethers'

import { getLogger } from './logger'

const logger = getLogger('Tools')

export const isAddress = (address: string): boolean => {
  try {
    utils.getAddress(address)
  } catch (e) {
    logger.log(`Address '${address}' doesn't exist`)
    return false
  }
  return true
}

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(utils.formatUnits(value, decimals)).toFixed(precision)

export const isContract = async (provider: any, address: string): Promise<boolean> => {
  const code = await provider.getCode(address)
  return code && code !== '0x'
}

export const parseBigNumber = (value: BigNumber, decimals = 18): number => {
  return Number(utils.formatUnits(value, decimals));
}
