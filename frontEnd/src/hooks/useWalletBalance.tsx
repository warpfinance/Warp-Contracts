import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { ERC20Service } from '../services/erc20'
import { Token } from '../util/token'


import { ConnectedWeb3Context } from './connectedWeb3'

export const useWalletTokenBalance = (token: Token, context: ConnectedWeb3Context): Maybe<BigNumber> => {
  const { account, library: provider } = context

  const [tokenBalances, setTokenBalances] = useState<Maybe<BigNumber>>(null)

  useEffect(() => {
    const isSubscribed = true

    const fetchTokenBalances = async () => {
      let tokenBalance = BigNumber.from(0);
      
      
      if (account) {
        const collateralService = new ERC20Service(provider, account, token.address)
        tokenBalance = await collateralService.balanceOf(account)
      }

      if (isSubscribed) {
        setTokenBalances(tokenBalances)
      }
    }


    fetchTokenBalances()
  }, [account, provider, token])

  return tokenBalances
}
