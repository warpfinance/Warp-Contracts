import { BigNumber } from "ethers";
import * as React from "react";
import { ConnectedWeb3Context } from "./connectedWeb3";
import { ERC20Service } from "../services/erc20";
import { WarpControlService } from "../services/warpControl";
import { Token } from "../util/token";
import { formatBigNumber } from "../util/tools";


export const useTokenEnabled = (control: WarpControlService, token: Token, context: ConnectedWeb3Context) => {
  const { account, library: provider } = context;

  const [tokenEnabledAmount, setTokenEnabledAmount] = React.useState(BigNumber.from(0));

  React.useEffect(() => {
    let isSubscribed = true;

    const fetchEnabledAmount = async () => {
      if (!account || !isSubscribed) {
        return;
      }

      let targetVault: string = "";
      if (token.isLP) {
        targetVault = await control.getLPVault(token.address);
      } else {
        targetVault = await control.getStableCoinVault(token.address);
      }

      const erc20 = new ERC20Service(provider, null, token.address);
      const enabledAmount = await erc20.allowance(account, targetVault);
      setTokenEnabledAmount(enabledAmount);
    }

    fetchEnabledAmount();

    return () => {
      isSubscribed = false;
    }
  }, [account, provider, token, control]);

  

  return {tokenEnabledAmount};
}
