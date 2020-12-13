import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React from 'react'
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault'
import { V1WarpControlService } from '../services/v1Control'
import { WarpLPVaultService } from '../services/warpLPVault'
import { getLogger } from '../util/logger'
import { getContractAddress, getTokensByNetwork } from '../util/networks'
import { Token } from '../util/token'
import { formatBigNumber } from '../util/tools'
import { useRefreshToken } from './useRefreshToken'

const logger = getLogger('Hooks::useMigrations')

export interface MigrationStatusContext {
  lpVaults: MigrationVault[];
  scVaults: MigrationVault[];
  needsMigration: boolean;
  refresh: Function;
}

export interface MigrationVault {
  vaultAddress: string;
  token: Token;
  amount: string
}

const MigrationStatusContext = React.createContext<MigrationStatusContext>({
  lpVaults: [],
  scVaults: [],
  needsMigration: false,
  refresh: () => {}
});

export const useMigrationStatus = () => {
  const context = React.useContext(MigrationStatusContext);
  return context;
} 

export const MigrationStatusProvider: React.FC = props => {
  const context = useWeb3React();

  const { account, library: provider, chainId: networkId } = context
  const [needsMigration, setNeedsMigration] = React.useState(false);
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
          hasAssetsToMigrate = true;
          scVaults.push({
            vaultAddress,
            amount: vaultBalance.toString(),
            token: scToken
          });

          logger.log(`${account} needs to migrate ${formatBigNumber(vaultBalance, scToken.decimals)} ${scToken.symbol}`);
        }
      }

      for (const lpToken of lpTokens) {
        const vaultAddress = await control.getLPVault(lpToken.address);
        const vault = new WarpLPVaultService(provider, account, vaultAddress);
        const vaultBalance = await vault.collateralBalance(account);
        if (vaultBalance.gt(BigNumber.from(0))) {
          hasAssetsToMigrate = true;
          lpVaults.push({
            vaultAddress,
            amount: vaultBalance.toString(),
            token: lpToken
          });

          logger.log(`${account} needs to migrate ${formatBigNumber(vaultBalance, lpToken.decimals)} ${lpToken.symbol}`);
        }
      }

      if (isSubscribed) {
        setNeedsMigration(hasAssetsToMigrate);
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
