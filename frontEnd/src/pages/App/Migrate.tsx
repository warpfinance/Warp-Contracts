import * as React from "react";

import { CustomButton, Header, MigrateTable } from "../../components";
import { Grid, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useLPTokens } from "../../hooks/useLPTokens";
import { useStableCoinTokens } from "../../hooks/useStableCoins";

const useStyles = makeStyles(theme => ({
}))

interface Props {
}

export const Migrate: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const context = useConnectedWeb3Context();
    const stableCoins = useStableCoinTokens(context);
    const lpTokens = useLPTokens(context);

    const onMigrateLendingAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onMigrateBorrowAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onWithdrawLendingAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onWithdrawBorrowAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={3}
            >
                <Header />
                <Grid item>
                    <Typography variant="h5">
                        Migrate to v2 for further LP support
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        Users can either choose to withdraw funds, or continue exploring Warp with v1
                    </Typography>
                </Grid>
                <Grid item>
                    <CustomButton text="Migrate to V2" type="long" />
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Grid item>
                        <MigrateTable
                            onMigrateClick={onMigrateLendingAssetClick}
                            onWithdrawClick={onWithdrawLendingAssetClick}
                            tokens={stableCoins}
                            type="lending" />
                    </Grid>
                    <Grid item>
                        <MigrateTable
                            onMigrateClick={onMigrateBorrowAssetClick}
                            onWithdrawClick={onWithdrawBorrowAssetClick}
                            tokens={lpTokens}
                            type="borrowing" />
                    </Grid>
                </Grid>
            </Grid >
        </React.Fragment>
    )
}