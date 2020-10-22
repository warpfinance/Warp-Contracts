import * as React from "react";

import { DashboardTable, Header, InformationCard } from "../../components";
import { Grid, LinearProgress, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    progress: {
        width: '30%',
    },
});

interface Props extends WithStyles<typeof styles> { }

const data = {
    borrowBalance: 0.00,
    borrowLimitPercentage: 0,
    borrowLimitUsd: 0,
    lendingBalance: 0.00,
    netApy: 25,
}

const DecoratedDashboardClass = withStyles(styles)(
    class DashboardClass extends React.Component<Props, {}> {
        render() {
            return (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={5}
                >
                    <Header connected={true} />
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
                            <InformationCard header="Net APY" text={`${data.netApy.toLocaleString()}%`}/>
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
                        <div className={this.props.classes.progress}>
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
                            <DashboardTable type="borrowing"/>
                        </Grid>
                    </Grid>
                </Grid >
            );
        }
    }
)

const Dashboard = connect(null, null)(DecoratedDashboardClass)

export { Dashboard };