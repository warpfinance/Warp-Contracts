import { useWeb3React } from "@web3-react/core";
import React from "react";
import { launchNftTypes, WarpLaunchNftService } from "../services/warpLaunchNft";
import { getLogger } from "../util/logger";
import { getContractAddress } from "../util/networks";
import { useRefreshToken } from "./useRefreshToken";


export interface LaunchNftsContext {
  hasFetched: boolean,
  claimableNfts: string[],
  ownedNfts: string[],
  refresh: () => void,
}

const LaunchNftsContext = React.createContext<LaunchNftsContext>({
  hasFetched: false,
  claimableNfts: [],
  ownedNfts: [],
  refresh: () => {}
});

export const useLaunchNfts = () => {
  const context = React.useContext(LaunchNftsContext);
  return context;
}

const logger = getLogger(`hooks::useLaunchNfts`);

export const LaunchNftsProvider: React.FC = props => {
  const context = useWeb3React();

  const { account, library: provider, chainId: networkId } = context;

  const [hasFetched, setHasFetched] = React.useState(false);
  const [claimableNfts, setClaimableNfts] = React.useState<string[]>([]);
  const [ownedNfts, setOwnedNfts] = React.useState<string[]>([]);
  const {refreshToken, refresh} = useRefreshToken();

  React.useEffect(() => {
    let isSubscribed = true;

    if (!networkId || !account) {
      logger.log(`Not connected to a network and account yet.`);
      return;
    }

    const fetchLaunchNfts = async () => {
      const launchNftControl = new WarpLaunchNftService(provider, account, getContractAddress(networkId, 'launchNftControl'));

      logger.log(`Fetching NFTs.`);

      const claimable: string[] = [];
      const owns: string[] = [];

      for (const nftType of launchNftTypes) {
        if (await launchNftControl.canClaimType(account, nftType)) {
          claimable.push(nftType);
        }
        if (await launchNftControl.hasNftType(account, nftType)) {
          owns.push(nftType);
        }
      }

      logger.log(`Can claim ${claimable}`);
      logger.log(`Owns ${owns}`);
      

      if (isSubscribed) {
        setHasFetched(true);
        setClaimableNfts(claimable);
        setOwnedNfts(owns);
      }
    }

    fetchLaunchNfts();

    return () => {
      isSubscribed = false;
    }
  }, [networkId, account, refreshToken])


  const value = React.useMemo(() => ({
    hasFetched,
    claimableNfts,
    ownedNfts,
    refresh
  }), [hasFetched, claimableNfts, ownedNfts, refresh]);

  return <LaunchNftsContext.Provider value={value}>{props.children}</LaunchNftsContext.Provider>;
}