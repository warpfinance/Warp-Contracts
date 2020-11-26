import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { UniswapLPTokenService } from '../services/uniswapLP'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'

const logger = getLogger('Hooks::useLPTokens')

export const useLPTokens = (context: ConnectedWeb3Context) => {
  const defaultTokens = getTokensByNetwork(context.networkId, true)
  const [tokens, setTokens] = useState<Token[]>(defaultTokens)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        logger.log("Fetching lp tokens");
        const tokenAddresses = defaultTokens.map((token: Token) => {
          return {
            address: token.address,
            symbol: token.symbol
          }
        });
        const tokens: Token[] = await Promise.all(
          tokenAddresses.map(async (data: {
            address: string,
            symbol: string
          }) => {
            const erc20 = new UniswapLPTokenService(context.library, null, data.address);
            const erc20Info = await erc20.getProfileSummary();
            const {image, image2} = getImageUrl(data.address);
            const token = {
              ...erc20Info,
              image,
              image2
            }

            token.lpType = token.symbol;
            token.symbol = data.symbol;
            token.isLP = true;

            // const tokenPairAddresses = [await erc20.token0(), await erc20.token1()];
            // const tokenPair: Token[] = [];

            // for (const address of tokenPairAddresses) {
            //   const tokenERC20 = new ERC20Service(context.library, null, address);
            //   const tokenInfo = await tokenERC20.getProfileSummary();
            // }

            return token;
          }),
        )
        
        setTokens(tokens);
      } catch (e) {
        logger.error('There was an error getting the tokens:', e)
      }
    }

    fetchTokens()
  }, [context.library, context.networkId])

  return tokens
}
