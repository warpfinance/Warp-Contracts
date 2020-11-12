import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'

import { utils } from 'ethers'
import { RefreshToken } from './useRefreshToken'

const logger = getLogger('Hooks::useTotalWalletBalance')

export const useTotalWalletBalance = (context: ConnectedWeb3Context, refreshToken?: RefreshToken) => {
  const tokens = getTokensByNetwork(context.networkId, false)
  const [walletBalance, setWalletBalance] = useState<string>("0")

  useEffect(() => {
    const fetchTotalWalletBalance = async () => {
      if (!context.account) {
        logger.log("Cannot read wallet balance without a connected wallet.")
        return;
      }

      let amount = BigNumber.from(0);
      for (const token of tokens) {
        const tokenService = new ERC20Service(context.library, context.account, token.address);

        const tokenBalance = await tokenService.balanceOf(context.account);
        const tokenInfo = await tokenService.getProfileSummary();

        // @TODO: Need to an actual conversion
        const divisor = BigNumber.from(10).pow(BigNumber.from(tokenInfo.decimals));
        const inDollars = tokenBalance.div(divisor);

        amount = amount.add(inDollars);
      }

      setWalletBalance(amount.toString());
    }

    fetchTotalWalletBalance()
  }, [context.library, context.networkId, refreshToken])

  return walletBalance
}
