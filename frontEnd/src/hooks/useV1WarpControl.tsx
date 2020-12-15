import { useMemo } from 'react'
import { V1WarpControlService } from '../services/v1Control';
import { getContractAddress } from '../util/networks';
import { ConnectedWeb3Context } from './connectedWeb3'

export const useV1WarpControl = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId } = context

  const controlAddress = getContractAddress(networkId, 'v1Control');
  const control = useMemo(() => new V1WarpControlService(provider, account, controlAddress), [
    controlAddress,
    provider,
    account
  ]);

  return useMemo(() => ({
    control
  }),
  [control]);
}
