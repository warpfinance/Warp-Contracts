import React from 'react'

interface TeamNameContext {
  inATeam: boolean
  teamName: string
}

// TO-DO: Get current team name from web3
const defaultValues: TeamNameContext = {inATeam: false, teamName: ""};
export const TeamNameContext = React.createContext<TeamNameContext>(defaultValues);
