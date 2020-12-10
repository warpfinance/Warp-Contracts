import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, LeaderboardTable } from "../../components";

import { teams } from "../../util/teams"
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

export const Leadboard: React.FC<Props> = (props: Props) => {

    const metrics = useTeamMetrics();
    const { refreshToken, refresh } = useRefreshToken();

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            spacing={5}
        >
            <Header />
            <Typography variant="h4">
                NFT Campaign
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                Users are competing for Warp NFTs for 1 week that
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                give them access to additional Warp Rewards!
            </Typography>
            <LeaderboardTable refreshToken={refreshToken} teams={teams}/>
        </Grid >
    )
}