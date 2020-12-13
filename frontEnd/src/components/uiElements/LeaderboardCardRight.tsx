import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";

interface Props {
}

export const LeaderboardCardRight: React.FC<Props> = (props: Props) => {

    return (
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
    )
}
