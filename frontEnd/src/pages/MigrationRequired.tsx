import { useWeb3React } from "@web3-react/core"
import React, { useEffect } from "react"
import { Redirect } from "react-router-dom"
import { ConnectedWeb3, WhenNotConnected } from "../hooks/connectedWeb3"
import { useMigrationStatus } from "../hooks/useMigrations"

interface Props {
  page: React.ReactNode;
}

export const MigrationRequired: React.FC<Props> = props=> {
  const migrationStatus = useMigrationStatus();
  const [willRedirect, setWillRedirect] = React.useState(migrationStatus.needsMigration);

  useEffect(() => {
    setWillRedirect(migrationStatus.needsMigration);
  }, [migrationStatus.needsMigration]);

  return (
    <React.Fragment>
      {willRedirect ? <Redirect to="/migrate" /> : null}
      <ConnectedWeb3>
        {props.page}
        {props.children}
      </ConnectedWeb3>
    </React.Fragment>
  )
}