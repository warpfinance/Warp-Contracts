import * as React from "react";

import { Card, CardContent, Grid, Typography, makeStyles } from "@material-ui/core";
import { Header, LeaderboardTable } from "../../components";

import { getLogger } from "../../util/logger";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

const useStyles = makeStyles(theme => ({
    leaderboardCard: {
        minHeight: "281px",
        minWidth: "362px",
    },
}));

export const Leaderboard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const { teams, firstLoad, refresh } = useTeamMetrics();

    return (
        <Grid
            alignItems="center"
            container
            direction="row"
            justify="space-around"
            spacing={1}
        >
            <Grid
                item
                xs={12}
            >
                <Header />
            </Grid>
            <Grid
                item
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                xs={3}
            >
                <Typography variant="h5">
                    Information
                </Typography>
                <Card className={classes.leaderboardCard}>
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
                                League table is updated 2x a day
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                xs={6}
            >
                <Grid item>
                    <Typography variant="h4">
                        NFT Campaign
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
                    <LeaderboardTable teams={teams} />
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                xs={3}
            >
                <Typography variant="h5">
                    Team NFTs classification
                </Typography>
                <Card className={classes.leaderboardCard}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="flex-start"
                        >
                            <Typography variant="subtitle1" color="textSecondary">
                                Top 5 Teams
                            </Typography>
                            <Typography variant="subtitle1">
                                Legendary NFTs
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Top 25 Teams
                            </Typography>
                            <Typography variant="subtitle1">
                                Rare NFTs
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                NFT campaign
                            </Typography>
                            <Typography variant="subtitle1">
                                Team Participation NFT
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    )
}