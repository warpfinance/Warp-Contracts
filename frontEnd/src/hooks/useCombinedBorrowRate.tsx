import React from "react";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { calculateAPYFromRate } from "../util/interest";
import { getLogger } from "../util/logger";
import { Token } from "../util/token";
import { parseBigNumber } from "../util/tools";
import { ConnectedWeb3Context } from "./connectedWeb3";
import { RefreshToken } from "./useRefreshToken";


const logger = getLogger('Hooks::useCombinedBorrowRate');

export const useCombinedBorrowRate = (context: ConnectedWeb3Context, control: WarpControlService, stableCoins: Token[], refreshToken?: RefreshToken) => {

    const [totalInterestRate, setTotalInterestRate] = React.useState(0);

    React.useEffect(() => {
      let isSubscribed = true;
    
      const calculateRate = async() => {
          logger.log("Calculating total interest rate.");
          if (!context.account || !control) {
              return;
          }
    
          logger.log("Calculating total interest rate.");
    
          interface BorrowStats {
              amount: number;
              rate: number;
          }
    
          const borrowStats: BorrowStats[] = [];
    
          for (const token of stableCoins) {
              const targetVault = await control.getStableCoinVault(token.address);
              const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
    
              const stats: BorrowStats = {
                  rate: calculateAPYFromRate(parseBigNumber(await vault.borrowRate())),
                  amount: parseBigNumber(await vault.borrowedAmount(context.account), token.decimals)
              }

              logger.log(`User is borrowing ${stats.amount} ${token.symbol} at ${stats.rate}`);
    
              borrowStats.push(stats);
          }

          const totalBorrowedAmount = borrowStats.reduce((a: number, b: BorrowStats) => {
              return a + b.amount;
          }, 0);

          let calculatedRate = 0;
          if (totalBorrowedAmount > 0) {
            for (const stats of borrowStats) {
                calculatedRate = calculatedRate + (stats.amount / totalBorrowedAmount) * stats.rate;
              }
          }
          

          if (isSubscribed) {
              logger.log(`Calculated weighted borrow rate is ${calculatedRate}`)
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
