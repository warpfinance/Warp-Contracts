import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";

// TO-DO: Web3 integration
const borrowData = {
    totalMarket: 1253253.47,
    totalMarketApy: 1.25,
    dailyVolume: 4844872.12,
    numberOfParticipants: 6723
}

// TO-DO: Web3 integration
const lendData = {
    totalMarket: 2556448.70,
    totalMarketApy: 3.40,
    dailyVolume: 8167836.98,
    numberOfParticipants: 2425
}

interface Props {
    type: "borrower" | "lender"
}

export const MarketCard: React.FC<Props> = (props: Props) => {
    const data = props.type === "borrower" ? borrowData : lendData;
    return (
        <Card>
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                    spacing={10}
                >
                    <Grid
                        item
                        direction="column"
                        justify="space-around"
                        alignItems="flex-start"
                    >
                        <Typography variant="subtitle1" color="textSecondary">
                            Total {props.type} market
                                </Typography>
                        <Typography variant="h4">
                            {"$" + data.totalMarket.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="h4" color={data.totalMarketApy > 0 ? "secondary" : "error"} >
                            {data.totalMarketApy > 0 ? `+${data.totalMarketApy}%` : `${data.totalMarketApy}%`}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        direction="column"
                        justify="space-around"
                        alignItems="flex-start"
                    >
                        <Typography variant="subtitle1" color="textSecondary">
                            24H {props.type} volume
                                </Typography>
                        <Typography variant="subtitle1">
                            {"$" + data.dailyVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            # of {props.type}s
                                </Typography>
                        <Typography variant="subtitle1">
                            {data.numberOfParticipants}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}