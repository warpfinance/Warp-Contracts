import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const borrowData = {
    totalMarket: 1253253.47,
    totalMarketApy: 1.25,
    dailyVolume: 4844872.12,
    numberOfParticipants: 6723
}

const lendData = {
    totalMarket: 2556448.70,
    totalMarketApy: 3.40,
    dailyVolume: 8167836.98,
    numberOfParticipants: 2425
}

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    type: "borrower" | "lender"
}

const DecoratedMarketCardClass = withStyles(styles)(
    class MarketCardClass extends React.Component<Props, {}> {
        render() {
            const data = this.props.type === "borrower" ? borrowData : lendData;
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
                                    Total {this.props.type} market
                                </Typography>
                                <Typography variant="h4">
                                    {"$" + data.totalMarket.toLocaleString()}
                                </Typography>
                                <Typography variant="h4" color={data.totalMarketApy > 0? "secondary" : "error"} >
                                    {data.totalMarketApy > 0? `+${data.totalMarketApy}%`: `${data.totalMarketApy}%`}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                direction="column"
                                justify="space-around"
                                alignItems="flex-start"
                            >
                                <Typography variant="subtitle1" color="textSecondary">
                                    24H {this.props.type} volume
                                </Typography>
                                <Typography variant="subtitle1">
                                    {"$" + data.dailyVolume.toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    # of {this.props.type}s
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
    }
)

const MarketCard = connect(null, null)(DecoratedMarketCardClass)

export { MarketCard };