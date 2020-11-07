import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { ERC20Service } from '../services/erc20'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { WarpControlService } from '../services/warpControl'
import { WarpLPVaultService } from '../services/warpLPVault'
import { getContractAddress } from '../util/networks'
import { Token } from '../util/token'


import { ConnectedWeb3Context } from './connectedWeb3'

export const useTokenBalance = (token: Token, context: ConnectedWeb3Context) => {
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

      if (token.isLP) {
        const vaultAddress = await control.getLPVault(token.address);
        const lpVault = new WarpLPVaultService(provider, account, vaultAddress);
        setVaultBalance(await lpVault.collateralBalance(account));
      } else {
        const vaultAddress = await control.getStableCoinVault(token.address);
        const scVault = new StableCoinWarpVaultService(provider, account, vaultAddress);
        setVaultBalance(await scVault.getBalance(account));
      }

    }


    fetchTokenBalances();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token])

  return {walletBalance, vaultBalance}
}
