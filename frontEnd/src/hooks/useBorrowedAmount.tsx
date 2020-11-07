import { BigNumber } from "ethers";
import React, { useEffect } from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { getLogger } from "../util/logger";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";


const logger = getLogger('Hooks::useBorrowedAmount');

export const useBorrowedAmount = (context: ConnectedWeb3Context, control: WarpControlService, token: Token) => {
  const [borrowedAmount, setBorrowedAmount] = React.useState(BigNumber.from(0));

  useEffect(() => {
    let isSubscribed = true;

    const fetchBorrowLimit = async () => {
      if (!isSubscribed || !context.account) {
        return;
      }

      const targetVault = await control.getStableCoinVault(token.address);
      const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

      logger.log("Fetching borrowed amount of " + token.address)

      const amount = await vault.borrowedAmount(context.account);

      setBorrowedAmount(amount);
    }

    fetchBorrowLimit();

    return () => {
      isSubscribed = false;
    }
  }, [context, control])

  return borrowedAmount;
}