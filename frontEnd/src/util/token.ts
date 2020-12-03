import { BigNumber, utils } from 'ethers'

const tokenImages: {[key: string]: string | string[]} = {
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai.png',
  '0x45f873Ed62f79441DaB1825Bf6ffa777f5e459Ff': 'dai.png',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usdc.png',
  '0xE6658C25062B42742dCaB46cEF6A5eC50D012472': 'usdc.png',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'usdt.png',
  '0xfb7ad8AfC2c53AE8f0DAb58EEDd4FEE33D2BFe8a': 'usd2.png',
  '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11': ['eth.png', 'dai.png'],
  '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852': ['eth.png', 'usdt.png'],
  '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc': ['eth.png', 'usdc.png'],
  '0xbb2b8038a1640196fbe3e38816f3e67cba72d940': ['eth.png', 'wbtc.png'],
  '0xA6a1aa0d43c6fAaD3c94b2d0c05d6e612a98fc91': ['eth.png', 'dai.png'],
  '0xdd2a1E1cc61E7673F359b054B317D19Af46524eA': ['eth.png', 'usdt.png'],
  '0xC1851fd8760338c07126705b30d9b52c157e072a': ['eth.png', 'usdc.png'],
  '0x3ec6Ad9baDb786EC94581502FD35EE4edE7C243E': ['eth.png', 'wbtc.png'],
  
}

export function getImageUrl(tokenAddress?: string): {image?: string, image2?: string} {
  if (!tokenAddress) return {}
  if (tokenImages[tokenAddress]) {
    const images = tokenImages[tokenAddress];
    if (typeof images === 'string') {
      return {image: images}
    } else {
      return {
        image: images[0],
        image2: images[1]
      } 
    }
  }

  tokenAddress = utils.getAddress(tokenAddress)
  return {image: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png` }
}

export interface Token {
  address: string
  decimals: number
  symbol: string
  image?: string
  image2?: string
  lpType?: string
  isLP?: boolean
}

export interface StableCoin extends Token {
  wallet: BigNumber
  vault: BigNumber
}