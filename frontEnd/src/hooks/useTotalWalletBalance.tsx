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
  const [walletBalance, setWalletBalance] = useState<string>("0")

  useEffect(() => {
    const fetchTotalWalletBalance = async () => {
      if (!context.account) {
        logger.log("Cannot read wallet balance without a connected wallet.")
        return;
      }

      let amount = 0;
      for (const token of tokens) {
        const tokenService = new ERC20Service(context.library, context.account, token.address);

        
        const tokenInfo = await tokenService.getProfileSummary();
        const tokenBalance = parseBigNumber(await tokenService.balanceOf(context.account), tokenInfo.decimals);

        const usdcPriceOfToken = parseBigNumber(await control.getStableCoinPrice(token.address), usdc?.decimals);

        amount += tokenBalance * usdcPriceOfToken;
      }

      setWalletBalance(amount.toString());
    }

    fetchTotalWalletBalance()
  }, [context.library, context.networkId, refreshToken])

  return walletBalance
}
