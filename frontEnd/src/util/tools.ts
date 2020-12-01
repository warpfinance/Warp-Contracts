import { BigNumber, utils } from 'ethers'

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

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(utils.formatUnits(value, decimals)).toFixed(precision)

export const isContract = async (provider: any, address: string): Promise<boolean> => {
  const code = await provider.getCode(address)
  return code && code !== '0x'
}

export const parseBigNumber = (value: BigNumber, decimals = 18): number => {
  return Number(utils.formatUnits(value, decimals));
}

export const copyTextToClipboard = (text: string) => {
  if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
  }
  navigator.clipboard.writeText(text).then(function () {
  }, function (err) {
      console.error(err);
  });
}

const fallbackCopyTextToClipboard = (text: string) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
      document.execCommand('copy');
  } catch (err) {
      console.error(err);
  }

  document.body.removeChild(textArea);
}
