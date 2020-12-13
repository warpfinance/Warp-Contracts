import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";

import { lowercaseFirstLetter } from "../../util/tools";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props {
}

export const LeaderboardCardLeft: React.FC<Props> = (props: Props) => {
    const { timestamp } = useTeamMetrics();

    return (
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
    )
}
