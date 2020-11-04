import * as React from "react";

import { DashboardTable, Header, InformationCard } from "../../components";
import { Grid, LinearProgress, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    progress: {
        width: '30%',
    },
}));

interface Props { }

// TO-DO: Web3 integration
const data = {
    borrowBalance: 0.00,
    borrowLimitPercentage: 0,
    borrowLimitUsd: 0,
    lendingBalance: 0.00,
    netApy: 25,
}

export const Dashboard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            spacing={5}
        >
            <Header />
            <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
            >
                <Grid item>
                    <InformationCard header="Lending balance" text={`$${data.lendingBalance.toFixed(2)}`} />
                </Grid>
                <Grid item>
                    <InformationCard header="Net APY" text={`${data.netApy.toLocaleString()}%`} />
                </Grid>
                <Grid item>
                    <InformationCard header="Borrow balance" text={`$${data.borrowBalance.toFixed(2)}`} />
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`${data.borrowLimitPercentage}%`}
                    </Typography>
                </Grid>
                <div className={classes.progress}>
                    <LinearProgress color="secondary" variant="determinate" value={data.borrowLimitPercentage} />
                </div>
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`$${data.borrowLimitUsd}`}
                    </Typography>
                </Grid>
            </Grid>
            <Typography variant="subtitle1" color="textSecondary">
                Borrow limit
                    </Typography>
            <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
            >
                <Grid item>
                    <DashboardTable type="lending" />
                </Grid>
                <Grid item>
                    <DashboardTable type="borrowing" />
                </Grid>
            </Grid>
        </Grid >
    );
}