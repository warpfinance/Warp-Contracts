import * as React from "react";

import { Card, CardContent, Grid, Typography, makeStyles } from "@material-ui/core";
import { Header, TeamLeaderboardTable } from "../../components";

import { getLogger } from "../../util/logger";
import { lowercaseFirstLetter } from "../../util/tools";
import moment from "moment";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

export const IntraTeamLeaderboard: React.FC<Props> = (props: Props) => {
    const { teams, timestamp } = useTeamMetrics();

    return (
        <React.Fragment>
            <Header />
            <Grid
                alignItems="center"
                container
                direction="row"
            >
                <Grid
                    alignItems="center"
                    container
                    direction="column"
                    item
                    md={3}
                >
                    <Typography variant="h5">
                        Information
                </Typography>
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                direction="column"
                                justify="space-around"
                                alignItems="flex-start"
                            >
                                <Typography variant="subtitle1" color="textSecondary">
                                    TVL
                            </Typography>
                                <Typography variant="subtitle1">
                                    Total Value in USD of deposited LP tokens and stablecoin
                            </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    NFT campaign
                            </Typography>
                                <Typography variant="subtitle1">
                                    The leaderboard shows the current team TVL.
                            </Typography>
                                <Typography variant="subtitle1">
                                    Rewards will be distributed on average TVL to reward early contributors.
                            </Typography>
                                <Typography variant="subtitle1">
                                    {`The leaderboard is cached and was last updated ${lowercaseFirstLetter(moment(timestamp).calendar())}.`}
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
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
                <Grid
                    alignItems="center"
                    container
                    direction="column"
                    item
                    md={3}
                >
                    <Typography variant="h5">
                        Team NFTs classification
                </Typography>
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                direction="column"
                                justify="space-around"
                                alignItems="flex-start"
                            >
                                <Typography variant="subtitle1" color="textSecondary">
                                    Top 1–3 Teams
                            </Typography>
                                <Typography variant="subtitle1">
                                    Legendary 150% booster
                            </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Top 4–10 Teams
                            </Typography>
                                <Typography variant="subtitle1">
                                    Epic 75% booster
                            </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Remaining Participating Teams
                            </Typography>
                                <Typography variant="subtitle1">
                                    Rare 15% booster
                            </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}