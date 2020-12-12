import * as React from "react";

import { CustomButton, Header, MigrateTable, RowModal, WithdrawMigrateModal } from "../../components";
import { Grid, Typography } from "@material-ui/core";
import { convertNumberToBigNumber, parseBigNumber } from "../../util/tools";

import { BigNumber } from "ethers";
import { Token } from "../../util/token";
import { getLogger } from "../../util/logger";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useLPTokens } from "../../hooks/useLPTokens";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useWarpControl } from "../../hooks/useWarpControl";

interface Props {
}

const logger = getLogger("Page::Migrate");

export const Migrate: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const stableCoins = useStableCoinTokens(context);
    const lpTokens = useLPTokens(context);

    const [withdrawAmountValue, setWithdrawAmountValue] = React.useState("");
    const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);

    const [currentToken, setCurrentToken] = React.useState<Token>({} as Token);

    // TO-DO: Web3 Integration
    const onMigrateLendingAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }
    const onMigrateBorrowAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }
    const onWithdrawLendingAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(true);
    }
    const onWithdrawBorrowAssetClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(true);
    }
    const onWithdraw = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(false);
        setWithdrawAmountValue("");
    }
    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
    }
    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setWithdrawAmountValue(event.target.value);
    };
    const onWithdrawMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
            </Grid>
            <WithdrawMigrateModal
                action={"Withdraw"}
                error={false/*withdrawError*/}
                handleClose={handleWithdrawClose}
                onButtonClick={onWithdraw}
                onChange={onWithdrawAmountChange}
                onMaxButtonClick={onWithdrawMax}
                open={withdrawModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
                value={withdrawAmountValue}
            />
        </React.Fragment>
    )
}