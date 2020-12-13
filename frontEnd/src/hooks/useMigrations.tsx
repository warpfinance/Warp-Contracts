import { formatBigNumber, parseBigNumber } from '../util/tools'
import { getContractAddress, getTokensByNetwork } from '../util/networks'

import { BigNumber } from 'ethers'
import React from 'react'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { Token } from '../util/token'
import { V1WarpControlService } from '../services/v1Control'
import { WarpLPVaultService } from '../services/warpLPVault'
import { getLogger } from '../util/logger'
import { useRefreshToken } from './useRefreshToken'
import { useWeb3React } from '@web3-react/core'

const logger = getLogger('Hooks::useMigrations')

export interface MigrationStatusContext {
  lpVaults: MigrationVault[];
  scVaults: MigrationVault[];
  needsMigration: boolean;
  refresh: Function;
}

export interface MigrationVault {
  token: Token;
  amount: string;
  value: number; // value of vault in USDC
}

export const MigrationStatusContext = React.createContext<MigrationStatusContext>({
  lpVaults: [],
  scVaults: [],
  needsMigration: true /*false*/,
  refresh: () => {}
});

export const useMigrationStatus = () => {
  const context = React.useContext(MigrationStatusContext);
  return context;
} 

export const MigrationStatusProvider: React.FC = props => {
  const context = useWeb3React();

  const { account, library: provider, chainId: networkId } = context
  const [needsMigration, setNeedsMigration] = React.useState(true/*false*/);
  const [stableCoinMigrations, setStableCoinMigrations] = React.useState<MigrationVault[]>([]);
  const [lpMigrations, setLpMigrations] = React.useState<MigrationVault[]>([]);
  const {refreshToken, refresh} = useRefreshToken();

  React.useEffect(() => {
    if (!networkId || !account) {
      logger.log(`Not connected to a network and account yet.`);
      return;
    }

    let isSubscribed = true;

    const stableCoinTokens = getTokensByNetwork(networkId, false);
    const lpTokens = getTokensByNetwork(networkId, true);

    const usdcToken = stableCoinTokens.find((t: Token) => {
      return t.symbol === "USDC";
    });
    if (!usdcToken) {
      logger.error(`No USDC token registered.`);
      return;
    }

    const fetchMigrationData = async () => {
      if (!isSubscribed) {
        return;
      }

      logger.log(`Fetching migration stats for ${account}`);

      let hasAssetsToMigrate = false;
      const scVaults: MigrationVault[] = [];
      const lpVaults: MigrationVault[] = [];

      const control = new V1WarpControlService(provider, account, getContractAddress(networkId, 'v1Control'));

      for (const scToken of stableCoinTokens) {
        const vaultAddress = await control.getStableCoinVault(scToken.address);
        const vault = new StableCoinWarpVaultService(provider, account, vaultAddress);
        const vaultBalance = await vault.getBalance(account);
        if (vaultBalance.gt(BigNumber.from(0))) {
          const value = parseBigNumber(await control.getStableCoinPrice(scToken.address, vaultBalance), usdcToken.decimals);
          hasAssetsToMigrate = true;
          scVaults.push({
            amount: vaultBalance.toString(),
            token: scToken,
            value
          });

          logger.log(`${account} needs to migrate ${formatBigNumber(vaultBalance, scToken.decimals)} ${scToken.symbol}`);
        }
      }

      for (const lpToken of lpTokens) {
        const vaultAddress = await control.getLPVault(lpToken.address);
        const vault = new WarpLPVaultService(provider, account, vaultAddress);
        const vaultBalance = await vault.collateralBalance(account);
        if (vaultBalance.gt(BigNumber.from(0))) {
          const pricePerLP = await control.getLPPrice(lpToken.address);
          const lpAmount = parseBigNumber(vaultBalance, lpToken.decimals);
          const price = parseBigNumber(pricePerLP, usdcToken.decimals);
          const value = lpAmount * price;

          hasAssetsToMigrate = true;
          lpVaults.push({
            amount: vaultBalance.toString(),
            token: lpToken,
            value
          });

          logger.log(`${account} needs to migrate ${formatBigNumber(vaultBalance, lpToken.decimals)} ${lpToken.symbol}`);
        }
      }

      if (isSubscribed) {
        /*setNeedsMigration(hasAssetsToMigrate)*/;
        setLpMigrations(lpVaults);
        setStableCoinMigrations(scVaults);
      }

    }

    fetchMigrationData();

    return () => {
      isSubscribed = false;
    }
  }, [networkId, account, refreshToken]);

  const contextValue = React.useMemo<MigrationStatusContext>(() => ({
    needsMigration,
    lpVaults: lpMigrations,
    scVaults: stableCoinMigrations,
    refresh
  }), [needsMigration, lpMigrations, stableCoinMigrations]);

  return <MigrationStatusContext.Provider value={contextValue}>{props.children}</MigrationStatusContext.Provider>
}
