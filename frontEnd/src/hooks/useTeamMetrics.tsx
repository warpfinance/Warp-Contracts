import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import React, { useEffect, useState } from 'react'
import { string } from 'yargs';
import { ERC20Service } from '../services/erc20';
import { StableCoinWarpVaultService } from '../services/stableCoinWarpVault';
import { WarpControlService } from '../services/warpControl';
import { calculateTeamMetrics, Team } from '../util/calculateTeamMetrics';

import { getLogger } from '../util/logger'
import { getContractAddress, getTokensByNetwork } from '../util/networks';
import { Token } from '../util/token';
import { parseBigNumber } from '../util/tools';
import { ConnectedWeb3Context } from './connectedWeb3';
import { RefreshToken, useRefreshToken } from './useRefreshToken';
import { useTeamMetricsCache } from './useTeamMetricsCache';

const logger = getLogger('Hooks::useTeamMetrics');

export interface TeamMetricsContext {
  teams: Team[];
  firstLoad: boolean;
  refresh: Function;
  manuallyCalculate: Function;
}

const TeamMetricsContext = React.createContext<TeamMetricsContext>({
  teams: [],
  firstLoad: true,
  refresh: () => {},
  manuallyCalculate: () => {},
});

export const useTeamMetrics = () => {
  const context = React.useContext(TeamMetricsContext);
  return context;
}


export const TeamMetricsProvider: React.FC = props => {
  const context = useWeb3React();

  const { cachedTeams, attemptedToLoad } = useTeamMetricsCache();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const {refreshToken, refresh} = useRefreshToken();

  const manuallyCalculate = () => {
    logger.log(`Enabling manual calculations`);
    setShouldCalculate(true);
    refresh();
  }

  React.useEffect(() => {
    let isSubscribed = true;

    const fetchTeamMetrics = async () => {

      const validCache = cachedTeams && cachedTeams.length > 0;

      if (!validCache) {
        if (!attemptedToLoad) {
          logger.log("Cache hasn't loaded yet, giving it a minute.");
          return;
        } else {
          logger.warn("Cache is invalid");
        }
      }

      if (firstLoad) {
        logger.log(`Trying to get the first set of team metrics.`);
      }

      if (validCache && (!shouldCalculate || firstLoad)) {
        logger.log(`Would like to use cache if it's available.`);

        if (isSubscribed) {
          logger.log("Using cached team metrics");
          setTeamList(cachedTeams);
          setFirstLoad(false);

          if (!shouldCalculate) {
            logger.log("Should not calculate, halting.");
            return;
          }
        } else {
          logger.log("Not subscribed?");
          return
        }
      }

      if (!context.chainId || !context.library) {
        logger.log("Not ready to get team metrics");
        return;
      }

      logger.log("Calculating team metrics");

      const networkId = context.chainId;
      const provider = context.library;

      const calculatedTeams = await calculateTeamMetrics(provider, networkId);
      setTeamList(calculatedTeams);
      setFirstLoad(false);
    }

    fetchTeamMetrics();

    return () => {
      isSubscribed = false;
    }
  }, [context.library, context.chainId, context.account, refreshToken, cachedTeams, attemptedToLoad]);

  const value = React.useMemo(() => ({
    teams: teamList,
    firstLoad,
    refresh,
    manuallyCalculate
  }), [teamList, firstLoad]);

  return <TeamMetricsContext.Provider value={value}>{props.children}</TeamMetricsContext.Provider>
}
