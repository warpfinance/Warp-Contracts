import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, IntraTeamLeaderboardTable, LeaderboardCardLeft, LeaderboardCardRight, LeaderboardSubheader } from "../../components";

import { useParams } from "react-router-dom";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

export const IntraTeamLeaderboard: React.FC<Props> = (props: Props) => {
    const { teams } = useTeamMetrics();
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
                                    {team.name} Team
                                </Typography>
                            </Grid>
                            <LeaderboardSubheader/>
                            <Grid item>
                                <IntraTeamLeaderboardTable members={team.members} />
                            </Grid>
                        </Grid>
                        <Grid item xl={3}>
                            <LeaderboardCardRight />
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        </React.Fragment>
    )
}