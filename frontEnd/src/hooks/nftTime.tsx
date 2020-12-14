import React from 'react'

interface NftTimeContext {
  nftTime: boolean
}

const defaultValues: NftTimeContext = { nftTime: true };
export const NftTimeContext = React.createContext<NftTimeContext>(defaultValues);
