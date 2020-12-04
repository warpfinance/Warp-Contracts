import { BigNumber } from "ethers";
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

export const useCombinedBorrowRate = (context: ConnectedWeb3Context, control: WarpControlService, stableCoins: Token[], usdc: Maybe<Token>, refreshToken?: RefreshToken) => {

    const [totalInterestRate, setTotalInterestRate] = React.useState(0);

    React.useEffect(() => {
      let isSubscribed = true;
    
      const calculateRate = async() => {
          if (!context.account || !control || !usdc) {
              return;
          }
    
          logger.log("Calculating total borrowed interest rate.");
    
          interface BorrowStats {
              amount: number;
              rate: number;
          }
    
          const borrowStats: BorrowStats[] = [];
    
          for (const token of stableCoins) {
              const targetVault = await control.getStableCoinVault(token.address);
              const vault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
              const borrowedTokenAmount = await vault.borrowedAmount(context.account);
              if (borrowedTokenAmount.eq(BigNumber.from(0))) {
                  continue;
              }

              const tokenValueInUSDC = parseBigNumber(await control.getStableCoinPrice(token.address, borrowedTokenAmount), usdc.decimals);
    
              const stats: BorrowStats = {
                  rate: calculateAPYFromRate(parseBigNumber(await vault.borrowRate())),
                  amount: tokenValueInUSDC
              }

              logger.log(`User is borrowing $${stats.amount.toFixed(2)} (in USDC) ${token.symbol} at ${stats.rate.toFixed(2)}`);
    
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
              logger.log(`Calculated weighted borrow APY is ${calculatedRate.toFixed(2)}% on $${totalBorrowedAmount.toFixed(2)} (in USDC) of assets`)
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
