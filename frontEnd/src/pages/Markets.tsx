import * as React from "react";

import { BorrowerMarketCard, LenderMarketCard, MarketTable } from "../components";

import { Grid } from "@material-ui/core";
import { Header } from "../components";

interface Props { }

export const Markets: React.FC<Props> = (props: Props) => {
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
                    <LenderMarketCard />
                </Grid>
                <Grid item>
                    <BorrowerMarketCard />
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item sm>
                    <MarketTable type="lender" />
                </Grid>
                <Grid item sm>
                    <MarketTable type="borrower" />
                </Grid>
            </Grid>
        </Grid >
    )
}