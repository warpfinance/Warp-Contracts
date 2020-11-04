import { BigNumber, utils } from 'ethers'

const tokenImages: {[key: string]: string} = {
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai.png',
  '0x1528F3FCc26d13F7079325Fb78D9442607781c8C': 'dai.png',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdc.png',
  '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5': 'usdc.png',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'usdt.png'
}

export function getImageUrl(tokenAddress?: string): string | undefined {
  if (!tokenAddress) return undefined
  if (tokenImages[tokenAddress]) {
    return tokenImages[tokenAddress];
  }
  tokenAddress = utils.getAddress(tokenAddress)
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`
}

export interface Token {
  address: string
  decimals: number
  symbol: string
  image?: string
}

export interface StableCoin extends Token {
  wallet: BigNumber
  vault: BigNumber
}