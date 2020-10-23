import * as React from "react";

import { BorrowerTable, Header, InformationCard } from "../../components";
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
    collateral: 123.00,
    interestRate: 1.97,
    yieldFarmingRewards: 200,
}

const DecoratedBorrowerClass = withStyles(styles)(
    class BorrowerClass extends React.Component<Props, {}> {
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
                            <InformationCard header="Collateral" text={`$${data.collateral.toFixed(2)}`} />
                        </Grid>
                        <Grid item>
                            <InformationCard header="Yield farming rewards" text={`${data.yieldFarmingRewards} UNI`} />
                        </Grid>
                        <Grid item>
                            <InformationCard header="Interest rate" text={`${data.interestRate.toFixed(2)}%`} />
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
                            <BorrowerTable type="borrow" />
                        </Grid>
                        <Grid item>
                            <BorrowerTable type="repay" />
                        </Grid>
                    </Grid>
                </Grid >
            );
        }
    }
)

const Borrower = connect(null, null)(DecoratedBorrowerClass)

export { Borrower };