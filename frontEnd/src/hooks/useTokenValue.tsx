import { BigNumber } from "ethers";
import * as React from "react";
import { WarpControlService } from "../services/warpControl";
import { Token } from "../util/token";
import { formatBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";


export const useTokenValue = (control: WarpControlService, token: Token, context: ConnectedWeb3Context) => {
  const { account, library: provider } = context

  const [tokenValueInUSDC, setTokenValue] = React.useState(BigNumber.from(0));

  React.useEffect(() => {
    let isSubscribed = true;

    const fetchRates = async () => {
      if (!isSubscribed) {
        return;
      }

      let value = BigNumber.from(0);
      if (token.isLP) {
        value = await control.getLPPrice(token.address);
      } else {
        value = await control.getStableCoinPrice(token.address);
      }

      setTokenValue(value);
    }

    fetchRates();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token]);

  return {tokenValueInUSDC};
}
