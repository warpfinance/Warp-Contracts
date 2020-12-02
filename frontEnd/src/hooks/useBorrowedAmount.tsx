import { BigNumber } from "ethers";
import React, { useEffect } from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { getLogger } from "../util/logger";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";
import { RefreshToken } from "./useRefreshToken";


const logger = getLogger('Hooks::useBorrowedAmount');

export const useBorrowedAmount = (context: ConnectedWeb3Context, control: WarpControlService, token: Token, refreshToken?: RefreshToken) => {
  const [borrowedAmount, setBorrowedAmount] = React.useState(BigNumber.from(0));

  useEffect(() => {
    let isSubscribed = true;

    const fetchBorrowLimit = async () => {
      if (!isSubscribed || !context.account) {
        return;
      }

      const targetVault = await control.getStableCoinVault(token.address);
      const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

      const amount = await vault.borrowedAmount(context.account);

      logger.log(`User is borrowing ${amount.toString()} (${parseBigNumber(amount, token.decimals)}) ${token.symbol}`);

      setBorrowedAmount(amount);
    }

    fetchBorrowLimit();

    return () => {
      isSubscribed = false;
    }
  }, [context, control, refreshToken])

  return borrowedAmount;
}