import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, LeaderboardTable } from "../../components";

import { getLogger } from "../../util/logger";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

export const Leaderboard: React.FC<Props> = (props: Props) => {

    const {teams, firstLoad, refresh } = useTeamMetrics();

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
            <LeaderboardTable teams={teams}/>
        </Grid >
    )
}