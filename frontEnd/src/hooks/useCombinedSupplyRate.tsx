import React from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { calculateAPYFromRate } from "../util/interest";
import { getLogger } from "../util/logger";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";
import { RefreshToken } from "./useRefreshToken";


const logger = getLogger('Hooks::useCombinedSupplyRate');

export const useCombinedSupplyRate = (context: ConnectedWeb3Context, control: WarpControlService, stableCoins: Token[], refreshToken?: RefreshToken) => {

    const [totalInterestRate, setTotalInterestRate] = React.useState(0);

    React.useEffect(() => {
      let isSubscribed = true;
    
      const calculateRate = async() => {
          if (!context.account || !control) {
              return;
          }
    
          logger.log("Calculating total interest rate.");
    
          interface SupplyStats {
              amount: number;
              rate: number;
          }
    
          const supplyStats: SupplyStats[] = [];
    
          for (const token of stableCoins) {
              const targetVault = await control.getStableCoinVault(token.address);
              const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
    
              const stats: SupplyStats = {
                  rate: calculateAPYFromRate(parseBigNumber(await vault.supplyRate())),
                  amount: parseBigNumber(await vault.getBalance(context.account), token.decimals)
              }
    
              supplyStats.push(stats);
          }

          const totalBorrowedAmount = supplyStats.reduce((a: number, b: SupplyStats) => {
              return a + b.amount;
          }, 0);

          let calculatedRate = 0;
          for (const stats of supplyStats) {
            calculatedRate = calculatedRate + (stats.amount / totalBorrowedAmount) * stats.rate;
          }

          if (isSubscribed) {
              setTotalInterestRate(calculatedRate);
          }
      }
      calculateRate();
    
      return () => {
          isSubscribed = false;
      }
      
    
    }, [context.account, context.library, context.networkId, stableCoins, control, refreshToken]);

    return totalInterestRate;
}
