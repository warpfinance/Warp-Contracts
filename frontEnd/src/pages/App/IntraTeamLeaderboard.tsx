import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, IntraTeamLeaderboardTable, LeaderboardCardLeft, LeaderboardCardRight } from "../../components";

import { getLogger } from "../../util/logger";
import { useParams } from "react-router-dom";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

export const IntraTeamLeaderboard: React.FC<Props> = (props: Props) => {
    const { teams, timestamp } = useTeamMetrics();
    const { code } = useParams<{ code: string }>();
    const team = teams.find((team) => team.code === code);

    return (
        <React.Fragment>
            { team === undefined ?
                null :
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
                                    {team.name} Team
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
                                <IntraTeamLeaderboardTable members={team.members} />
                            </Grid>
                        </Grid>
                        <LeaderboardCardRight />
                    </Grid>
                </React.Fragment>
            }
        </React.Fragment>
    )
}