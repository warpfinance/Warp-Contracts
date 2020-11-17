import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";

import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useWarpControl } from "../../hooks/useWarpControl";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useVaultMetrics } from "../../hooks/useVaultMetrics";


interface Props {
}

export const LenderMarketCard: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const stableCoins = useStableCoinTokens(context);
    const { control } = useWarpControl(context);
    const usdcToken = useUSDCToken(context);

    const {borrowedAmount, amountInVault} = useVaultMetrics(context, control, stableCoins, usdcToken);

    // waiting on smart contracts
    const data = {
        totalMarket: amountInVault,
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