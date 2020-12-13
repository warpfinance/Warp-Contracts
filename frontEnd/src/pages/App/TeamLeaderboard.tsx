import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, LeaderboardCardLeft, LeaderboardCardRight, TeamLeaderboardTable } from "../../components";

import { getLogger } from "../../util/logger";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

export const TeamLeaderboard: React.FC<Props> = (props: Props) => {
    const { teams } = useTeamMetrics();

    return (
        <React.Fragment>
            <Header />
            <Grid
                alignItems="center"
                container
                direction="row"
            >
                <LeaderboardCardLeft />
                <Grid
                    alignItems="center"
                    container
                    direction="column"
                    item
                    md={6}
                >
                    <Grid item>
                        <Typography variant="h4">
                            Team NFT Campaign
                    </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" color="textSecondary">
                            Users are competing for Warp NFTs for 1 week that
                    </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" color="textSecondary">
                            give them access to additional Warp Rewards!
                    </Typography>
                    </Grid>
                    <Grid item>
                        <TeamLeaderboardTable teams={teams} />
                    </Grid>
                </Grid>
                <LeaderboardCardRight />
            </Grid>
        </React.Fragment>
    )
}