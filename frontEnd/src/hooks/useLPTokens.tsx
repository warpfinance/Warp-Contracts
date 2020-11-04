import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'
import { useContracts } from './useContracts'

const logger = getLogger('Hooks::useLPTokens')

export const useLPTokens = (context: ConnectedWeb3Context) => {
  const defaultTokens = getTokensByNetwork(context.networkId, true)
  const [tokens, setTokens] = useState<Token[]>(defaultTokens)

  return tokens
}
