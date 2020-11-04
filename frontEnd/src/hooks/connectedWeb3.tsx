import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import React, { useEffect, useState } from 'react'
import connectors from '../util/connectors'

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
  const [networkId, setNetworkId] = useState<number | null>(null)
  const context = useWeb3React()
  const { account, active, error, library } = context

  useEffect(() => {
    let isSubscribed = true

    console.log(context)

    // @TODO Setup Infura and move ConnectedWeb3 over the root
    //const connector = localStorage.getItem('CONNECTOR')

    // if (active) {
    //   if (connector && connector in connectors) {
    //     context.setConnector(connector)
    //   }
    // } else if (error) {
    //   console.log("error:" + error.message)
    //   localStorage.removeItem('CONNECTOR')
    //   context.setConnector('Infura')
    // } else {
    //   context.setConnector('Infura')
    // }

    if (!active) {
      context.activate(connectors.Infura);
    }

    const checkIfReady = async () => {
      if (context.chainId !== undefined && isSubscribed) {
          setNetworkId(context.chainId);
      }
    }

    if (library) {
      checkIfReady()
    }

    return () => {
      isSubscribed = false
    }
  }, [context, library, active, error])

  if (!networkId || !library) {
    return null
  }

  const value = {
    account: account || null,
    library,
    networkId,
    rawWeb3Context: context,
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}

export const WhenConnected: React.FC = props => {
  const { account } = useConnectedWeb3Context()

  return <>{account && props.children}</>
}
