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

export const convertNumberToBigNumber = (amount: number | string, decimals: number) => {
  if (typeof amount === "number") {
    amount = amount.toFixed(decimals);
  }
  const bigParsedAmount = utils.parseUnits(amount, decimals);
  return bigParsedAmount;
}

export const countDecimals = function (num: number | string) {
  if (typeof num === "number") {
    if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
    num = num.toString();
  }

  const splitOnDecimal = num.split(".");
  if (!splitOnDecimal || splitOnDecimal.length <= 1) {
    return 0;
  }
  
  return splitOnDecimal[1].length || 0; 
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

export const dateReviver = (key: any, value: any): any =>  {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

export function lowercaseFirstLetter(value: string){
  return value[0].toLowerCase() + value.slice(1);
}

export const getEnv = (variable: string, fallback?: string): string => {
	const res = process.env[variable];
	if (res) {
		return res;
	}

	return fallback ? fallback : "";
};

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}