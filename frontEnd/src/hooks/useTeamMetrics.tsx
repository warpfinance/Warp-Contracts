import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import React, { useEffect, useState } from 'react'
import { string } from 'yargs';
import { WarpControlService } from '../services/warpControl';

import { getLogger } from '../util/logger'
import { getContractAddress } from '../util/networks';
import { ConnectedWeb3Context } from './connectedWeb3';
import { RefreshToken, useRefreshToken } from './useRefreshToken';

const logger = getLogger('Hooks::useTeamMetrics');

export interface Team {
  name: string;
  code: string;
  tvl: string;
}

export interface TeamMetricsContext {
  teams: Team[];
  firstLoad: boolean;
  refresh: Function;
}

const TeamMetricsContext = React.createContext<TeamMetricsContext>({
  teams: [],
  firstLoad: true,
  refresh: () => {}
});

export const useTeamMetrics = () => {
  const context = React.useContext(TeamMetricsContext);
  return context;
}


export const TeamMetricsProvider: React.FC = props => {
  const context = useWeb3React();

  const [teamList, setTeamList] = useState<Team[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const {refreshToken, refresh} = useRefreshToken();

  React.useEffect(() => {
    let isSubscribed = true;

    const fetchTeamMetrics = async () => {
      if (!context.chainId || !context.library) {
        logger.log("not ready to get team metrics");
        return;
      }

      const provider = context.library;
      const networkId = context.chainId;

      const controlAddress = getContractAddress(networkId, 'warpControl');
      const control = new WarpControlService(provider, null, controlAddress);

      const teamCodes = await control.getTeams();
      console.log(teamCodes);

      for (let code of teamCodes) {
        const name = await control.getTeamName(code);
        const members = await control.getTeamMembers(code);

      }
    }

    fetchTeamMetrics();

    return () => {
      isSubscribed = false;
    }
  }, [context.library, context.chainId, context.account, refreshToken]);

  const value = React.useMemo(() => ({
    teams: teamList,
    firstLoad,
    refresh
  }), [teamList, firstLoad]);

  return <TeamMetricsContext.Provider value={value}>{props.children}</TeamMetricsContext.Provider>
}
