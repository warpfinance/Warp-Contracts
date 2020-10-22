import * as React from "react";

import { MarketCard, MarketTable } from "../components";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { Header } from "../components";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> { }

const DecoratedMarketsClass = withStyles(styles)(
    class MarketsClass extends React.Component<Props, {}> {
        render() {
            return (
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={5}
                >
                    <Header home={true} />
                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                    >
                        <Grid item>
                            <MarketCard type="lender" />
                        </Grid>
                        <Grid item>
                            <MarketCard type="borrower"/>
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
                            <MarketTable type="lender" />
                        </Grid>
                        <Grid item>
                            <MarketTable type="borrower"/>
                        </Grid>
                    </Grid>
                </Grid >
            )
        }
    }
)

const Markets = connect(null, null)(DecoratedMarketsClass)

export { Markets };