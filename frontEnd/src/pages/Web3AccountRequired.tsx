import { useWeb3React } from "@web3-react/core"
import React, { useEffect } from "react"
import { Redirect } from "react-router-dom"
import { ConnectedWeb3, WhenNotConnected } from "../hooks/connectedWeb3"

export const Web3AccountRequired: React.FC = props=> {

  const context = useWeb3React()
  const { account, active, error, library } = context
  const [willRedirect, setWillRedirect] = React.useState(!context.account);

  useEffect(() => {
    setWillRedirect(!context.account);
  }, [context, library, active, error]);

  return (
    <React.Fragment>
      {willRedirect ? <Redirect to="/connect" /> : null}
      <ConnectedWeb3>
        {props.children}
      </ConnectedWeb3>
    </React.Fragment>
  )
}