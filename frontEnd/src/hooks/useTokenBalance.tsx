import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { ERC20Service } from '../services/erc20'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { WarpControlService } from '../services/warpControl'
import { WarpLPVaultService } from '../services/warpLPVault'
import { getLogger } from '../util/logger'
import { getContractAddress } from '../util/networks'
import { Token } from '../util/token'
import { formatBigNumber, parseBigNumber } from '../util/tools'


import { ConnectedWeb3Context } from './connectedWeb3'
import { RefreshToken } from './useRefreshToken'

const logger = getLogger('Hooks:UseTokenBalance');

export const useTokenBalance = (token: Token, context: ConnectedWeb3Context, refreshToken?: RefreshToken) => {
  const { account, library: provider, networkId } = context

  const control = new WarpControlService(provider, account, getContractAddress(networkId, 'warpControl'));

  const [walletBalance, setWalletBalance] = useState<BigNumber>(BigNumber.from(0));
  const [vaultBalance, setVaultBalance] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    let isSubscribed = true

    const fetchTokenBalances = async () => {
      if (!isSubscribed || !account) {
        return;
      }
      let walletBalance = BigNumber.from(0);
      
      
      const tokenService = new ERC20Service(provider, account, token.address);
      walletBalance = await tokenService.balanceOf(account);
      setWalletBalance(walletBalance);

      let balance = BigNumber.from(0);
      if (token.isLP) {
        const vaultAddress = await control.getLPVault(token.address);
        const lpVault = new WarpLPVaultService(provider, account, vaultAddress);
        balance = await lpVault.collateralBalance(account);
        
      } else {
        const vaultAddress = await control.getStableCoinVault(token.address);
        const scVault = new StableCoinWarpVaultService(provider, account, vaultAddress);
        balance = await scVault.getBalance(account);
      }

      logger.log(`User has a vault balance of ${formatBigNumber(balance, token.decimals, token.decimals)} ${token.symbol} (${balance}))`);
      setVaultBalance(balance);

    }


    fetchTokenBalances();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token, refreshToken])

  return {walletBalance, vaultBalance}
}
