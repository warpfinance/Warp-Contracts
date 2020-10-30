import { useMemo } from 'react'
import { ConnectedWeb3Context } from './connectedWeb3'

export const useContracts = (context: ConnectedWeb3Context) => {
  const { account, library: provider, networkId } = context


  return {};
}
