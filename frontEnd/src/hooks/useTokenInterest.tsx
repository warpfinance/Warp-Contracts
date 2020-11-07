import * as React from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { calculateAPYFromRate } from "../util/interest";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";


export const useTokenInterest = (control: WarpControlService, token: Token, context: ConnectedWeb3Context) => {
  const { account, library: provider } = context

  const [tokenBorrowRate, setTokenBorrowRate] = React.useState(0);
  const [tokenSupplyRate, setTokenSupplyRate] = React.useState(0);

  React.useEffect(() => {
    let isSubscribed = true;

    // Consider refactoring
    if (token.isLP) {
      return;
    }

    const fetchRates = async () => {
      if (!isSubscribed) {
        return;
      }


      const vaultAddress = await control.getStableCoinVault(token.address);
      const stableCoinVault = new StableCoinWarpVaultService(provider, account, vaultAddress);
      
      const supplyRate = await stableCoinVault.supplyRate();
      const borrowRate = await stableCoinVault.borrowRate();

      const supplyAPY = calculateAPYFromRate(parseBigNumber(supplyRate));
      const borrowAPY = calculateAPYFromRate(parseBigNumber(borrowRate));

      setTokenSupplyRate(supplyAPY);
      setTokenBorrowRate(borrowAPY);
    }

    fetchRates();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token]);

  return {tokenBorrowRate, tokenSupplyRate};
}
