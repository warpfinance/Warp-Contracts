import React from 'react'

// TO-DO: Web3 Integration
interface V1Context {
  v1: boolean
}

const defaultValues: V1Context = {v1: true};
export const V1Context = React.createContext<V1Context>(defaultValues);
