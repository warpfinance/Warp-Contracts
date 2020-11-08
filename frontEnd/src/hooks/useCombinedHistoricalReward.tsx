import React from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { calculateAPYFromRate } from "../util/interest";
import { getLogger } from "../util/logger";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";


const logger = getLogger('Hooks::useCombinedHistoricalReward');

export const useCombinedHistoricalReward = (context: ConnectedWeb3Context, control: WarpControlService, stableCoins: Token[], usdc: Maybe<Token>) => {

    const [totalReward, setTotalReward] = React.useState(0);

    React.useEffect(() => {
      let isSubscribed = true;
    
      const fetchAsync = async() => {
          if (!context.account || !control) {
              return;
          }
    
          logger.log("Calculating total stablecoin reward.");
    
          let calculatedReward = 0;
          for (const token of stableCoins) {
              try {
                  const targetVault = await control.getStableCoinVault(token.address);
                  const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
                  const reward = parseBigNumber(await vault.getHistoricalReward(context.account), token.decimals);
                  const usdcPriceOfToken = parseBigNumber(await control.getStableCoinPrice(token.address), usdc?.decimals);
        
                  calculatedReward = calculatedReward + (reward * usdcPriceOfToken);
              } catch (e) {
                  logger.error("Failed to get reward amount for " + token.symbol);
                  logger.info(e);
              }
          }

          if (isSubscribed) {
            setTotalReward(calculatedReward);
          }
      }
      fetchAsync();
    
      return () => {
          isSubscribed = false;
      }
      
    
    }, [context.account, context.library, context.networkId, stableCoins, control, usdc]);

    return totalReward;
}
