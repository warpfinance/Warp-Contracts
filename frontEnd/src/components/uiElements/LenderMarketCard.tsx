import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";



interface Props {
}

export const LenderMarketCard: React.FC<Props> = (props: Props) => {
    // waiting on smart contracts
    const data = {
        totalMarket: 2556448.70,
    }
    
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
                            Total Lender market
                                </Typography>
                        <Typography variant="h4">
                            {"$" + data.totalMarket.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}