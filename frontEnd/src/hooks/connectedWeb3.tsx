import { useWeb3React } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'
import { providers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import connectors from '../util/connectors'
import { WalletType } from '../util/types'

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
  const [onLoadConnecting, setOnLoadConnecting] = useState<boolean>(true);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const context = useWeb3React()
  const { account, active, error, library } = context

  const isNoEthereumProviderError = error instanceof NoEthereumProviderError;
  const isUserRejectedRequestError = error instanceof UserRejectedRequestError;

  useEffect(() => {
    let isSubscribed = true;


    const tryConnect = async () => {
      // const connector = localStorage.getItem('CONNECTOR');

      // if (!active && connector) {
      //   // if (connector) {
      //   //   try {
      //   //     if (connector as WalletType === WalletType.MetaMask) {
      //   //       await context.activate(connectors.MetaMask, undefined, true);
      //   //     }
      //   //   } catch (e) {
      //   //     console.log(e);
      //   //     localStorage.removeItem('CONNECTOR');
      //   //     await context.activate(connectors.Infura);
      //   //   }
      //   // }
      // } else 
      if (!active) {
        console.log("fallback")
        await context.activate(connectors.Infura);
      }
    }

    tryConnect();

    // if (onLoadConnecting) {
    //   setOnLoadConnecting(false);
    //   tryConnect();
    // }

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

export const WhenNotConnected: React.FC = props => {
  const { account } = useConnectedWeb3Context()

  return <>{!account && props.children}</>
}
