import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { ERC20Service } from '../services/erc20'
import { getLogger } from '../util/logger'
import { getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'

import { ConnectedWeb3Context } from './connectedWeb3'

import { utils } from 'ethers'
import { WarpControlService } from '../services/warpControl'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { OracleFactoryService } from '../services/oracleFactory'
import { useUSDCToken } from './useUSDC'
import { parseBigNumber } from '../util/tools'
import { RefreshToken } from './useRefreshToken'

const logger = getLogger('Hooks::useTotalLentAmount')

export const useTotalLentAmount = (context: ConnectedWeb3Context, control: WarpControlService, usdc: Maybe<Token>, refreshToken?: RefreshToken) => {
  const tokens = getTokensByNetwork(context.networkId, false)
  const [lentAmount, setLentAmount] = useState<number>(0);

  useEffect(() => {
    let isSubscribed = true;

    const fetchAsync = async () => {
      if (!context.account) {
        logger.log("Cannot read wallet balance without a connected wallet.")
        return;
      }

      // const oracleAddress = await control.oracle();
      // const oracle = new OracleFactoryService(context.library, context.account, oracleAddress);
      // const usdc = new ERC20Service(context.library, context.account, await oracle.USDC());

      logger.log("Fetching total lent amount");

      let amount = 0;
      for (const token of tokens) {
        try {
          const targetVault = await control.getStableCoinVault(token.address);
          const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
          const tokenService = new ERC20Service(context.library, context.account, token.address);
          const tokenBalance = parseBigNumber(await vault.getBalance(context.account), await tokenService.decimals());
          const usdcPriceOfToken = parseBigNumber(await control.getStableCoinPrice(token.address), usdc?.decimals);

          const tokenBalanceInUSDC = tokenBalance * usdcPriceOfToken;
          amount = amount + tokenBalanceInUSDC;
        } catch (e) {
          logger.error("Failed to get lent amount for " + token.symbol);
          logger.info(e);
        }
      }

      if (isSubscribed) {
        setLentAmount(amount);
      }
    }

    fetchAsync()
    return () => {
      isSubscribed = false;
    }
  }, [context.library, context.networkId, control, usdc, refreshToken])

  return lentAmount
}
