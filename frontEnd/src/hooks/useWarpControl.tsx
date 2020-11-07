import { useMemo } from 'react'
import { WarpControlService } from '../services/warpControl';
import { getContractAddress } from '../util/networks';
import { ConnectedWeb3Context } from './connectedWeb3'

export const useWarpControl = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId } = context

  const controlAddress = getContractAddress(networkId, 'warpControl');
  const control = useMemo(() => new WarpControlService(provider, account, controlAddress), [
    controlAddress,
    provider,
    account
  ]);

  return useMemo(() => ({
    control
  }),
  [control]);
}
