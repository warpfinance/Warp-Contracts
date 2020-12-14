import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, LeaderboardCardLeft, LeaderboardCardRight, LeaderboardSubheader, TeamLeaderboardTable } from "../../components";

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
                <Grid item xl={3}>
                    <LeaderboardCardLeft />
                </Grid>
                <Grid
                    alignItems="center"
                    container
                    direction="column"
                    item
                    xl={6}
                >
                    <Grid item>
                        <Typography variant="h4">
                            Team NFT Campaign
                        </Typography>
                    </Grid>
                    <LeaderboardSubheader />
                    <Grid item>
                        <TeamLeaderboardTable teams={teams} />
                    </Grid>
                </Grid>
                <Grid item xl={3}>
                    <LeaderboardCardRight />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}