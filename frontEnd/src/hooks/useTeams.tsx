import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import React, { useEffect, useState } from 'react'
import { WarpControlService } from '../services/warpControl';

import { getLogger } from '../util/logger'
import { getContractAddress } from '../util/networks';
import { ConnectedWeb3Context } from './connectedWeb3';
import { RefreshToken, useRefreshToken } from './useRefreshToken';

const logger = getLogger('Hooks::useTeams');

export interface TeamContext {
  onTeam: boolean;
  teamCode: string;
  teamName: string;
  refresh: Function;
}

const TeamContext = React.createContext<TeamContext>({
  onTeam: false,
  teamCode: "",
  teamName: "",
  refresh: () => {}
});

export const useTeams = () => {
  const context = React.useContext(TeamContext);
  return context;
}

export const TeamContextProvider: React.FC = props => {
  const context = useWeb3React();

  const [onTeam, setOnTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const {refreshToken, refresh} = useRefreshToken();
  
  useEffect(() => {
    let isSubscribed = true;
    const fetchTeamData = async () => {
      if (!context.account || !context.chainId || !context.library) {
        logger.log("not ready to get team info");
        // We must have disconnected
        if (isSubscribed && onTeam) {
          setOnTeam(false);
          setTeamCode("");
          setTeamName("");
        }
        return;
      }
      const provider = context.library;
      const networkId = context.chainId;
      const userAccount = context.account;
      
      const controlAddress = getContractAddress(networkId, 'warpControl');
      const control = new WarpControlService(provider, userAccount, controlAddress);

      const foundOnTeam = await control.hasJoinedTeam(userAccount);

      if (!foundOnTeam) {
        logger.log(`User ${userAccount} is not on a team.`)
        if (isSubscribed) {
          setOnTeam(false);
          setTeamCode("");
          setTeamName("");
        }
        return;
      }

      const foundTeamCode = await control.getTeamCode(userAccount);
      console.log(foundTeamCode);
      const foundTeamName = await control.getTeamName(foundTeamCode);
      console.log(foundTeamName);

      logger.log(`User ${userAccount} is on team ${foundTeamName} (${foundTeamCode})`);

      if (isSubscribed) {
        setOnTeam(foundOnTeam);
        setTeamCode(foundTeamCode);
        setTeamName(foundTeamName);
      }
    }

    fetchTeamData();

    return () => {
      isSubscribed = false;
    }
  }, [context.library, context.chainId, context.account, refreshToken])

  const value = React.useMemo(() => ({
    onTeam,
    teamName,
    teamCode,
    refresh
  }), [
    onTeam,
    teamName,
    teamCode,
  ])

  return <TeamContext.Provider value={value}>{props.children}</TeamContext.Provider>
}
