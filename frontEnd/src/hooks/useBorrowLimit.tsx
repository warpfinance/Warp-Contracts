import { BigNumber } from "ethers";
import React, { useEffect } from "react";
import { WarpControlService } from "../services/warpControl";
import { getLogger } from "../util/logger";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";


const logger = getLogger('Hooks::useBorrowLimit');

export const useBorrowLimit = (context: ConnectedWeb3Context, control: WarpControlService) => {
  const [borrowLimit, setBorrowLimit] = React.useState(BigNumber.from(0));
  const [totalBorrowedAmount, setBorrowedAmount] = React.useState(BigNumber.from(0));

  useEffect(() => {
    let isSubscribed = true;

    const fetchBorrowLimit = async () => {
      if (!isSubscribed || !context.account) {
        return;
      }

      logger.log("Fetching borrow total and limit.")

      const limit = await control.getBorrowLimit(context.account);
      const amount = await control.getBorrowAmount(context.account);

      setBorrowLimit(limit);
      setBorrowedAmount(amount);
    }

    fetchBorrowLimit();

    return () => {
      isSubscribed = false;
    }
  }, [context, control])

  return {totalBorrowedAmount, borrowLimit};
}