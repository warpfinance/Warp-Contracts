import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'
import { useContracts } from './useContracts'

const logger = getLogger('Hooks::useStableCoins')

export const useStableCoinTokens = (context: ConnectedWeb3Context) => {
  const defaultTokens = getTokensByNetwork(context.networkId)
  const [tokens, setTokens] = useState<Token[]>(defaultTokens)

  

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenAddresses = defaultTokens.map((token: Token) => {
          return token.address
        });
        const tokens: Token[] = await Promise.all(
          tokenAddresses.map(async tokenAddress => {
            const erc20 = new ERC20Service(context.library, null, tokenAddress);
            const erc20Info = await erc20.getProfileSummary();
            const token = {
              ...erc20Info,
              image: getImageUrl(tokenAddress)
            }

            return token;
          }),
        )
        
        setTokens(tokens);
      } catch (e) {
        logger.error('There was an error getting the tokens:', e)
      }
    }

    //fetchTokens()
  }, [context.library, context.networkId])

  return tokens
}
