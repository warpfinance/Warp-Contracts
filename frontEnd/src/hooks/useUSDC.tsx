import { BigNumber } from 'ethers'
import React from 'react'
import { useEffect, useState } from 'react'
import { ERC20Service } from '../services/erc20'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { WarpControlService } from '../services/warpControl'
import { getContractAddress, getTokensByNetwork } from '../util/networks'
import { getImageUrl, Token } from '../util/token'


import { ConnectedWeb3Context } from './connectedWeb3'

export const useUSDCToken = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId } = context;

  const [usdcToken, setUSDCToken] = React.useState<Maybe<Token>>(null);

  useEffect(() => {
    let isSubscribed = true

    const allTokens = getTokensByNetwork(networkId, false);
    const targetToken = allTokens.find((t: Token) => {
      return t.symbol === "USDC";
    });
    if (!targetToken) {
      setUSDCToken(null);
      return;
    }

    setUSDCToken(targetToken);

    const fetchUSDCData = async () => {
      if (!isSubscribed) {
        return;
      }
      const tokenAddress = targetToken.address;
      const erc20 = new ERC20Service(provider, account, tokenAddress);
      const erc20Info = await erc20.getProfileSummary();
      const {image, image2} = getImageUrl(tokenAddress);
      const token = {
        ...erc20Info,
        image,
        image2
      }

      token.isLP = false;

      setUSDCToken(token);
    }

    fetchUSDCData();

    return () => {
      isSubscribed = false;
    }
  }, [provider, account, networkId])



  return usdcToken;
}
