import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'

import { utils } from 'ethers'
import { RefreshToken } from './useRefreshToken'
import { parseBigNumber } from '../util/tools'
import { WarpControlService } from '../services/warpControl'

const logger = getLogger('Hooks::useTotalWalletBalance')

export const useTotalWalletBalance = (context: ConnectedWeb3Context, control: WarpControlService, usdc: Maybe<Token>, refreshToken?: RefreshToken) => {
  const tokens = getTokensByNetwork(context.networkId, false)
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    const fetchTotalWalletBalance = async () => {
      if (!context.account) {
        logger.log("Cannot read wallet balance without a connected wallet.")
        return;
      }

      if (!usdc) {
        return;
      }

      let amount = 0;
      for (const token of tokens) {
        const tokenService = new ERC20Service(context.library, context.account, token.address);

        const tokenBalanceRaw = await tokenService.balanceOf(context.account);
        
        const tokenInfo = await tokenService.getProfileSummary();

        const tokenBalance = parseBigNumber(tokenBalanceRaw, tokenInfo.decimals);

        
        if (token.symbol === usdc.symbol) {
          amount += tokenBalance;
          continue
        }

        const tokenValueRaw = await control.getStableCoinPrice(token.address);

        const usdcPriceOfToken = parseBigNumber(tokenValueRaw, usdc.decimals);

        amount += tokenBalance * usdcPriceOfToken;
      }

      setWalletBalance(amount);
    }

    fetchTotalWalletBalance()
  }, [context.library, context.networkId, refreshToken, usdc])

  return walletBalance
}
