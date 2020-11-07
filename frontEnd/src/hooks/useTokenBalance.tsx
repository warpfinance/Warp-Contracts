import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { ERC20Service } from '../services/erc20'
import { Token } from '../util/token'


import { ConnectedWeb3Context } from './connectedWeb3'

export const useTokenBalance = (token: Token, context: ConnectedWeb3Context) => {
  const { account, library: provider } = context

  const [walletBalance, setWalletBalance] = useState<Maybe<BigNumber>>(null);
  const [vaultBalance, setVaultBalance] = useState<Maybe<BigNumber>>(null);

  useEffect(() => {
    let isSubscribed = true

    const fetchTokenBalances = async () => {
      let walletBalance = BigNumber.from(0);
      
      
      if (account) {
        const tokenService = new ERC20Service(provider, account, token.address)
        walletBalance = await tokenService.balanceOf(account);
      }

      if (isSubscribed) {
        setWalletBalance(walletBalance)
      }
    }


    fetchTokenBalances();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token])

  return {walletBalance, vaultBalance}
}
