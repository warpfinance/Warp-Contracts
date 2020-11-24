import React from 'react'

const BorrowerCountdownContext = React.createContext(true)

/**
 * This hook can only be used by components under the `BorrowerCountdownContext` component. Otherwise it will throw.
 */
export const useBorrowerCountdownContext = () => {
  const context = React.useContext(BorrowerCountdownContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
