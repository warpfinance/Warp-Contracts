import { StableCoinWarpVaultService, WarpControlService } from '../contracts';
import { parseBigNumber, Token, TotalValueLocked } from '../util';

export interface ScTokenVault {
  token: Token;
  vault: StableCoinWarpVaultService;
  valueInUSDC: number;
}

export interface GetUserTVLConfig {
  control: WarpControlService;
  scVaults: ScTokenVault[];
  usdcToken: Token;
}

export const createGetUserTVLConfig = async (control: WarpControlService, scTokens: Token[], usdcToken: Token) => {
  const scTokenVaults: ScTokenVault[] = [];
  for (const scToken of scTokens) {
    const vaultAddress = await control.getStableCoinVault(scToken.address);
    const vault = new StableCoinWarpVaultService(vaultAddress, control.provider, null);
    const usdcValue = parseBigNumber(await control.getStableCoinPrice(scToken.address), usdcToken.decimals);
    scTokenVaults.push({
      token: scToken,
      vault,
      valueInUSDC: usdcValue,
    });
  }

  const cachedConfig: GetUserTVLConfig = {
    control,
    scVaults: scTokenVaults,
    usdcToken,
  };

  return cachedConfig;
};

export const getUserTVL = async (account: string, config: GetUserTVLConfig): Promise<TotalValueLocked> => {
  const lpTVL = parseBigNumber(await config.control.getTotalCollateralValue(account), config.usdcToken.decimals);

  let scTVL = 0;
  for (const tokenVault of config.scVaults) {
    const tokenAmount = parseBigNumber(await tokenVault.vault.getBalance(account), tokenVault.token.decimals);
    const value = tokenVault.valueInUSDC * tokenAmount;
    scTVL += value;
  }

  return {
    sc: scTVL,
    lp: lpTVL,
    tvl: scTVL + lpTVL,
  };
};
