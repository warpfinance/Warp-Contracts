import { ethers } from "ethers";
import { StableCoinWarpVaultService, WarpControlService } from "../contracts";
import { getLogger, parseBigNumber, Token } from "../util";

export interface ScTokenVault {
  token: Token,
  vault: StableCoinWarpVaultService,
  valueInUSDC: number,
}

export interface GetUserTVLConfig {
  control: WarpControlService;
  scVaults: ScTokenVault[];
  usdcToken: Token;
}

export interface UserTVL {
  sc: number;
  lp: number;
  tvl: number;
}

const logger = getLogger("Logic::TVL");

export const getUserTVL = async (account: string, config: GetUserTVLConfig): Promise<UserTVL> => {
  const lpTVL = parseBigNumber(await config.control.getTotalCollateralValue(account), config.usdcToken.decimals);

  let scTVL = 0;
  for (const tokenVault of config.scVaults) {
    const tokenAmount = parseBigNumber(await tokenVault.vault.getBalance(account), tokenVault.token.decimals);
    const value = tokenVault.valueInUSDC * tokenAmount;
    scTVL += value;
  }

  // logger.log(`${account} TVL is ${lpTVL} (LP) + ${scTVL} (SC)`);

  return {
    sc: scTVL,
    lp: lpTVL,
    tvl: scTVL + lpTVL
  }
}
