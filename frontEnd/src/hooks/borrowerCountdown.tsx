import React from 'react'

interface BorrowerCountdownContext {
  countdown: boolean
  countdownText: string
}

const defaultValues: BorrowerCountdownContext = {countdown: true, countdownText: ""};
export const BorrowerCountdownContext = React.createContext<BorrowerCountdownContext>(defaultValues);
