import * as React from "react";

import { CustomButton, DashboardTable, Header, InformationCard } from "../../components";
import { Grid, LinearProgress, Typography } from "@material-ui/core";

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { makeStyles } from "@material-ui/core/styles";
import { parseBigNumber } from "../../util/tools";
import { useBorrowLimit } from "../../hooks/useBorrowLimit";
import { useCombinedBorrowRate } from "../../hooks/useCombinedBorrowRate";
import { useCombinedSupplyRate } from "../../hooks/useCombinedSupplyRate";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useLPTokens } from "../../hooks/useLPTokens";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useTotalLentAmount } from "../../hooks/useTotalLentAmount";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useWarpControl } from "../../hooks/useWarpControl";
import { useMigrationStatus } from "../../hooks/useMigrations";

const useStyles = makeStyles(theme => ({
    progress: {
        width: '30%',
    },
}));

interface Props { }

export const Dashboard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const migrationStatus = useMigrationStatus();
    const v1 = migrationStatus.needsMigration;

    const context = useConnectedWeb3Context();
    const stableCoins = useStableCoinTokens(context);
    const lpTokens = useLPTokens(context);
    const { control } = useWarpControl(context);
    const usdc = useUSDCToken(context);
    const supplyBalance = useTotalLentAmount(context, control, usdc);
    const { totalBorrowedAmount, borrowLimit } = useBorrowLimit(context, control);
    const combinedBorrowRate = useCombinedBorrowRate(context, control, stableCoins, usdc);
    const combinedSupplyRate = useCombinedSupplyRate(context, control, stableCoins, usdc);

    let borrowBalanceUSDC = 0;
    let borrowLimitUSDC = 0;
    let borrowPercent = 0;

    if (usdc) {
        borrowBalanceUSDC = parseBigNumber(totalBorrowedAmount, usdc.decimals);
        borrowLimitUSDC = parseBigNumber(borrowLimit, usdc.decimals);
        if (borrowLimitUSDC > borrowBalanceUSDC) {
            borrowPercent = (borrowBalanceUSDC / borrowLimitUSDC) * 100;
        } else {
            borrowPercent = 0;
        }
    }

    let netApy = 0;

    if (borrowBalanceUSDC > 0 || supplyBalance > 0) {
        const totalAmount = borrowBalanceUSDC + supplyBalance;
        netApy = combinedSupplyRate * (supplyBalance / totalAmount) - combinedBorrowRate * (borrowBalanceUSDC / totalAmount);
    }

    const data = {
        borrowBalance: borrowBalanceUSDC,
        borrowLimitPercentage: borrowPercent,
        borrowLimitUsd: borrowLimitUSDC,
        lendingBalance: supplyBalance,
        netApy,
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            spacing={5}
        >
            <Header />
            <BorrowerCountdownContext.Consumer>
                {value =>
                    value.countdown === true ?
                        <Grid
                            item
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Typography color="textSecondary">
                                Warp borrowing starts in
                                    </Typography>
                            <Typography>
                                {value.countdownText}
                            </Typography>
                        </Grid>
                        :
                        null
                }
            </BorrowerCountdownContext.Consumer>
            <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
            >
                <Grid item>
                    <InformationCard header="Lending balance (in USDC)" text={`$${data.lendingBalance.toFixed(2)}`} />
                </Grid>
                <Grid item>
                    <InformationCard header="Net APY" text={`${data.netApy.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`} />
                </Grid>
                <Grid item>
                    <InformationCard header="Borrow balance (in USDC)" text={`$${data.borrowBalance.toFixed(2)}`} />
                </Grid>
            </Grid>
            {v1 === true ?
            <Grid
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <CustomButton href="/migrate" text="Migrate to V2" type="long"/>
            </Grid>
            :
            null
            }
            <Grid
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`${data.borrowLimitPercentage.toFixed(0)}%`}
                    </Typography>
                </Grid>
                <div className={classes.progress}>
                    <LinearProgress color="secondary" variant="determinate" value={data.borrowLimitPercentage} />
                </div>
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`$${data.borrowLimitUsd.toLocaleString(undefined, {
                            maximumFractionDigits: 0
                        })}`}
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
                    <DashboardTable tokens={stableCoins} type="lending" />
                </Grid>
                <Grid item>
                    <DashboardTable tokens={lpTokens} type="borrowing" />
                </Grid>
            </Grid>
        </Grid >
    );
}