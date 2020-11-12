import React, { useEffect } from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";



export const useVaultMetrics = (context: ConnectedWeb3Context, control: WarpControlService, stableCoins: Token[], usdc: Maybe<Token>) => {

  const [borrowedAmount, setBorrowedAmount] = React.useState(0);
  const [amountInVault, setAmountInVault] = React.useState(0);

  useEffect(() => {
    let isSubscribed = true;

    const fetchMetrics = async () => {
      let inVault = 0;
      let borrowed = 0;

      for (const token of stableCoins) {
        const targetVault = await control.getStableCoinVault(token.address);
        const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
        const usdcPriceOfToken = parseBigNumber(await control.getStableCoinPrice(token.address), usdc?.decimals);

        let tokenSupply = parseBigNumber(await vault.getAmountInVault(), token.decimals);
        let tokenBorrowed = parseBigNumber(await vault.getTotalAmountBorrowed(), token.decimals);      
        console.log(token.symbol, tokenSupply, tokenBorrowed, usdcPriceOfToken, usdc?.decimals); 

        inVault += tokenSupply * usdcPriceOfToken;
        borrowed += tokenBorrowed * usdcPriceOfToken;
      }

      if (isSubscribed) {
        setBorrowedAmount(borrowed);
        setAmountInVault(inVault);
      }
    }

    fetchMetrics();

    return () => {
      isSubscribed = false;
    }
  }, [context, stableCoins, usdc])


  return {borrowedAmount, amountInVault}
}