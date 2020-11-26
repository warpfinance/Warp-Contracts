import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import connectors from '../util/connectors'
import { useWhatChanged } from '@simbathesailor/use-what-changed';

export interface ConnectedWeb3Context {
  account: Maybe<string>
  library: providers.Web3Provider
  networkId: number
  rawWeb3Context: any
}

const ConnectedWeb3Context = React.createContext<Maybe<ConnectedWeb3Context>>(null)

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC = props => {
  const context = useWeb3React()
  const { account, active, error, library } = context

  const deps = [library, active, error];
  useWhatChanged(deps, 'library, active, error')
  useEffect(() => {
    let isSubscribed = true;

    const tryConnect = async () => {
      console.log(active);
      if (!active) {
        console.log("fallback")
        await context.activate(connectors.Infura);
      }
    }

    tryConnect();

    return () => {
      isSubscribed = false
    }
  }, deps)

  const value = useMemo(() => ({
    account: account || null,
    library,
    networkId: context.chainId,
    rawWeb3Context: context,
  }), [
    account, library
  ]) as ConnectedWeb3Context;

  if (!context.chainId || !library) {
    return null
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}

export const WhenConnected: React.FC = props => {
  const { account } = useConnectedWeb3Context()

  return <>{account && props.children}</>
}

export const WhenNotConnected: React.FC = props => {
  const { account } = useConnectedWeb3Context()

  return <>{!account && props.children}</>
}
