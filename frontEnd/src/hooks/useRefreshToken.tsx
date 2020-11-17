import React from "react";

export declare type RefreshToken = number;

export const useRefreshToken = () => {
  const [refreshToken, setRefreshToken] = React.useState<RefreshToken>(0);

  const refresh = () => {
    setRefreshToken(refreshToken + 1);
  }

  return {refreshToken, refresh};
}
