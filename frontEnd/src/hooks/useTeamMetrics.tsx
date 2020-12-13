import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react'
import { calculateTeamMetrics, Team } from '../util/calculateTeamMetrics';

import { getLogger } from '../util/logger'
import { useRefreshToken } from './useRefreshToken';
import { useTeamMetricsCache } from './useTeamMetricsCache';

const logger = getLogger('Hooks::useTeamMetrics');

export interface TeamMetricsContext {
  teams: Team[];
  timestamp: Date;
  firstLoad: boolean;
  refresh: Function;
  manuallyCalculate: Function;
}

const TeamMetricsContext = React.createContext<TeamMetricsContext>({
  teams: [],
  timestamp: new Date(0),
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

  const { cache, attemptedToLoad } = useTeamMetricsCache();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [timestamp, setTimeStamp] = useState(new Date(0));
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

      let validCache = false; 
      
      try {
        validCache = !!cache && cache.teams.length > 0;
      } catch (e) {
        logger.log(`Failed to validate cache`);
      }

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
          if (!cache) {
            logger.log(`Tried to use cache but it was null`);
            return;
          }

          logger.log("Using cached team metrics");
          setTeamList(cache.teams);
          setTimeStamp(cache.timestamp);
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

      const teamMetrics = await calculateTeamMetrics(provider, networkId);
      setTeamList(teamMetrics.teams);
      setTimeStamp(teamMetrics.timestamp);
      setFirstLoad(false);
    }

    fetchTeamMetrics();

    return () => {
      isSubscribed = false;
    }
  }, [context.library, context.chainId, context.account, refreshToken, cache, attemptedToLoad]);

  const value = React.useMemo(() => ({
    teams: teamList,
    timestamp,
    firstLoad,
    refresh,
    manuallyCalculate
  }), [teamList, firstLoad]);

  return <TeamMetricsContext.Provider value={value}>{props.children}</TeamMetricsContext.Provider>
}
