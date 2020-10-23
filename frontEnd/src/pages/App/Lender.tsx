import * as React from "react";

import { Header, InformationCard, LenderTable } from "../../components";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    progress: {
        width: '30%',
    },
});

interface Props extends WithStyles<typeof styles> { }

const data = {
    stableCoinDeposit: 0.00,
    stableCoinReward: 4545,
    walletBalance: 656
}

const DecoratedLenderClass = withStyles(styles)(
    class LenderClass extends React.Component<Props, {}> {
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
                            <InformationCard header="Stable coin deposit" text={`$${data.stableCoinDeposit.toFixed(2)}`} />
                        </Grid>
                        <Grid item>
                            <InformationCard header="Stable coin reward" text={`$${data.stableCoinReward}`} />
                        </Grid>
                        <Grid item>
                            <InformationCard header="Wallet balance" text={`$${data.walletBalance}`} />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                    >
                        <Grid item>
                            <LenderTable type="lend" />
                        </Grid>
                        <Grid item>
                            <LenderTable type="withdraw" />
                        </Grid>
                    </Grid>
                </Grid >
            );
        }
    }
)

const Lender = connect(null, null)(DecoratedLenderClass)

export { Lender };