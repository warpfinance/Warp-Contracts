import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    dashboardCard: {
        minWidth: "300px"
    }
});

interface Props extends WithStyles<typeof styles> {
    header: string,
    text: string
}

const DecoratedDashboardCardClass = withStyles(styles)(
    class DashboardCardClass extends React.Component<Props, {}> {
        render() {
            return (
                <Card className={this.props.classes.dashboardCard}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="center"
                        >
                            <Typography variant="subtitle1" color="textSecondary">
                                {this.props.header}
                            </Typography>
                            <Typography variant="h4">
                                {this.props.text}
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>
            )
        }
    }
)

const DashboardCard = connect(null, null)(DecoratedDashboardCardClass)

export { DashboardCard };