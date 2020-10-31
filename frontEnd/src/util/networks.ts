import { DEFAULT_TOKEN } from './constants'
import { getImageUrl, Token } from './token'

export type NetworkId = 1 | 42

export const networkIds = {
  MAINNET: 1,
  KOVAN: 42,
} as const

interface Network {
  label: string
  uri: string
  contracts: {
    warpControl: string,
    warpVault: string,
    warpWrapperToken: string,

  }
}

type KnownContracts = keyof Network['contracts']

const networks: { [K in NetworkId]: Network } = {
  [networkIds.MAINNET]: {
    label: 'Mainnet',
    uri: "https://mainnet.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
    contracts: {
      warpControl: "",
      warpVault: "",
      warpWrapperToken: ""
    }
  },
  [networkIds.KOVAN]: {
    label: 'Kovan',
    uri: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
    contracts: {
      warpControl: "",
      warpVault: "",
      warpWrapperToken: ""
    }
  }
}

export const supportedNetworks = networks;
export const supportedNetworkIds = Object.keys(networks).map(Number) as NetworkId[]

interface KnownTokenData {
  symbol: string
  decimals: number
  addresses: {
    [K in NetworkId]?: string
  }
  order: number
}


export const knownTokens: { [name in KnownToken]: KnownTokenData } = {
  dai: {
    symbol: 'DAI',
    decimals: 18,
    addresses: {
      [networkIds.MAINNET]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [networkIds.KOVAN]: '0x1528F3FCc26d13F7079325Fb78D9442607781c8C'
    },
    order: 1,
  },
  usdc: {
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [networkIds.KOVAN]: '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5'
    },
    order: 2,
  },
  usdt: {
    symbol: 'USDT',
    decimals: 6,
    addresses: {
      [networkIds.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    order: 3,
  },
}

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined
}

export const getContractAddress = (networkId: number, contract: KnownContracts) => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }
  return networks[networkId].contracts[contract]
}

export const getToken = (networkId: number, tokenId: KnownToken): Token => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  const token = knownTokens[tokenId]
  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`)
  }

  const address = token.addresses[networkId]

  if (!address) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  return {
    address,
    decimals: token.decimals,
    symbol: token.symbol,
    image: getImageUrl(address),
  }
}

export const getTokenFromAddress = (networkId: number, address: string): Token => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId]

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        address: tokenAddress,
        decimals: token.decimals,
        symbol: token.symbol,
      }
    }
  }

  throw new Error(`Couldn't find token with address '${address}' in network '${networkId}'`)
}

export const getContractAddressName = (networkId: number) => {
  const networkName = Object.keys(networkIds).find(key => (networkIds as any)[key] === networkId)
  const networkNameCase = networkName && networkName.substr(0, 1).toUpperCase() + networkName.substr(1).toLowerCase()
  return networkNameCase
}

export const getDefaultToken = (networkId: number) => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  return getToken(networkId, DEFAULT_TOKEN)
}

const isNotNull = <T>(x: T | null): x is T => {
  return x !== null
}

export const getTokensByNetwork = (networkId: number): Token[] => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  return Object.values(knownTokens)
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    .map(token => {
      const address = token.addresses[networkId]
      if (address) {
        return {
          symbol: token.symbol,
          decimals: token.decimals,
          image: getImageUrl(address),
          address,
        }
      }
      return null
    })
    .filter(isNotNull)
}