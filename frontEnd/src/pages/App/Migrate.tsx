import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, MigrateTable, RowModal, TransactionModal, WithdrawMigrateModal } from "../../components";

import { MigrateModal } from "../../components/modals/MigrateModal";
import { Token } from "../../util/token";
import { getLogger } from "../../util/logger";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useLPTokens } from "../../hooks/useLPTokens";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { MigrationVault, useMigrationStatus } from "../../hooks/useMigrations";
import { formatBigNumber } from "../../util/tools";
import { BigNumber } from "ethers";
import { TransactionInfo } from "../../util/types";
import { getContractAddress } from "../../util/networks";
import { V1WarpControlService } from "../../services/v1Control";
import { WarpControlService } from "../../services/warpControl";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";
import { WarpLPVaultService } from "../../services/warpLPVault";

interface Props {
}

const logger = getLogger("Page::Migrate");

declare type MigrationState = "start" | "withdraw" | "deposit" | "finish";

export const Migrate: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const { account, library: provider, networkId } = context
    const migrationStatus = useMigrationStatus();

    const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);

    // hacky default
    const [migrationVault, setMigrationVault] = React.useState<MigrationVault>({} as MigrationVault);

    // The quantity of tokens to display
    const [displayAmount, setDisplayAmount] = React.useState<string>("0");

    // The value (in USDC) of the displayed tokens to display
    const [displayValue, setDisplayValue] = React.useState<string>("0");

    const [migrationState, setMigrationState] = React.useState<MigrationState>("start");

    const [transactionSubmitted, setTransactionSubmitted] = React.useState<boolean>(false);
    const [transactionInfo, setTransactionInfo] = React.useState<TransactionInfo>({hash: ""} as TransactionInfo);

    const [migrateModalOpen, setMigrateModalOpen] = React.useState(false);
    const [migrateDepositDisabled, setMigrateDepositDisabled] = React.useState(true);
    const [migrateWithdrawDisabled, setMigrateWithdrawDisabled] = React.useState(true);

    const [transactionModalOpen, setTransactionModalOpen] = React.useState(false);

    const getV1Control = () => {
        const address = getContractAddress(networkId, 'v1Control');
        const control = new V1WarpControlService(provider, account, address);
        return control;
    }

    const getCurrentControl = () => {
        const address = getContractAddress(networkId, 'warpControl');
        const control = new WarpControlService(provider, account, address);
        return control;
    }

    const getScVault = async (control : V1WarpControlService | WarpControlService, token: string) => {
        const vaultAddress = await control.getStableCoinVault(token);
        const vault = new StableCoinWarpVaultService(provider, account, vaultAddress);
        return vault;
    }

    const getLpVault = async (control : V1WarpControlService | WarpControlService, token: string) => {
        const vaultAddress = await control.getLPVault(token);
        const vault = new WarpLPVaultService(provider, account, vaultAddress);
        return vault;
    }

    /* Looking back i realize i should've unified the interfaces */

    const getV1ScVault = async (token: string) => {
        const control = getV1Control();
        const vault = await getScVault(control, token);
        return vault;
    }

    const getV1LPVault = async (token: string) => {
        const control = getV1Control();
        const vault = await getLpVault(control, token);
        return vault; 
    }

    const getCurrentScVault = async (token: string) => {
        const control = getCurrentControl();
        const vault = await getScVault(control, token);
        return vault;
    }

    const getCurrentLpVault = async (token: string) => {
        const control = getCurrentControl();
        const vault = await getLpVault(control, token);
        return vault;
    }

    const handleStartTransaction = () => {
        setTransactionModalOpen(true);
        setTransactionSubmitted(false);
    }

    const handleTransaction = async (tx: Promise<TransactionInfo>) => {
        const txInfo = await tx;
        setTransactionInfo(txInfo);
        setTransactionSubmitted(true);

        return txInfo;
    }

    const setMigrationVaultStates = (vault: MigrationVault) => {
        setDisplayAmount(formatBigNumber(BigNumber.from(vault.amount), vault.token.decimals));
        setDisplayValue(vault.value.toLocaleString(undefined, {maximumFractionDigits: 2}));
        setMigrationVault(vault);
    }

    const onWithdrawClick = (vault: MigrationVault) => {
        setWithdrawModalOpen(true);
        setMigrationVaultStates(vault);
        logger.log(`Opening withdraw modal for ${vault.token.symbol}`);
    }

    const withdrawFromV1 = async (vault: MigrationVault) => {
        logger.log(`User is withdrawing ${vault.amount} ($${vault.value}) ${vault.token.symbol}`);

        if (!account) {
            throw Error("no account connected.");
        }

        handleStartTransaction();
        
        let tx: Maybe<Promise<TransactionInfo>> = null;
        if (vault.token.isLP) {
            const v1Control = getV1Control();
            const max = await v1Control.getMaxCollateralWithdrawAmount(account, vault.token.address);
            const v1Vault = await getV1LPVault(vault.token.address);
            tx = v1Vault.withdrawCollateral(max);
        } else {
            const v1Vault = await getV1ScVault(vault.token.address);
            tx = v1Vault.withdraw(BigNumber.from(vault.amount));
        }

        const txInfo = await handleTransaction(tx);

        return txInfo;
    }

    const depositFromV1 = async (vault: MigrationVault) => {
        logger.log(`User is depositing ${vault.amount} ${vault.token.symbol}`);

        handleStartTransaction();
        
        let tx: Maybe<Promise<TransactionInfo>> = null;
        if (vault.token.isLP) {
            const currentVault = await getCurrentLpVault(vault.token.address);
            tx = currentVault.withdrawCollateral(BigNumber.from(vault.amount));
        } else {
            const currentVault = await getCurrentScVault(vault.token.address);
            tx = currentVault.withdraw(BigNumber.from(vault.amount));
        }

        const txInfo = await handleTransaction(tx);

        return txInfo;
    }

    /* 
        Triggered when the user hits the "Withdraw" button inside the Withdraw modal
    */
    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const txInfo = await withdrawFromV1(migrationVault);
        setWithdrawModalOpen(false);

        await txInfo.finished;
        migrationStatus.refresh();
    }

    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
        setDisplayAmount("");
        setDisplayValue("");
    }


    const onMigrateClick = (vault: MigrationVault) => {
        setMigrateModalOpen(true);
        setMigrationVaultStates(vault);
        setMigrationState("start");
        setMigrateDepositDisabled(true);
        setMigrateWithdrawDisabled(false);
        logger.log(`User is migrating ${vault.token.symbol}`);
    }

    /* 
        Triggered when the user hits the "Withdraw" button inside the Migrate modal
    */
    const onMigrateWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const txInfo = await withdrawFromV1(migrationVault);
        setMigrationState("withdraw");

        await txInfo.finished;
        setTransactionModalOpen(false);

        setMigrateDepositDisabled(false);
        setMigrateWithdrawDisabled(true);
    }
    
    /* 
        Triggered when the user hits the "Deposit" button inside the Withdraw modal
    */
    const onMigrateDeposit = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const txInfo = await depositFromV1(migrationVault);
        setMigrationState("deposit");

        await txInfo.finished;

        console.log(`User has successfully migrated ${migrationVault.token.symbol}`);

        setTransactionModalOpen(false);
        setMigrationState("finish");
        setMigrateDepositDisabled(true);
        setMigrateWithdrawDisabled(true);
    }

    const handleMigrateClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason == "backdropClick") {
            console.log(`backdrop hit when migrating`);
            if (migrationState == "withdraw") {
                console.log(`User is mid-withdraw, ignoring close command`);
                return;
            }
        }
        
        setMigrateModalOpen(false);
        setDisplayAmount("");
        setDisplayValue("");
    }


    const handleTransactionModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTransactionModalOpen(false);
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
                    <Typography variant="h3">
                        Migrate to v2 for further LP support
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        You can either withdraw funds, or continue exploring Warp by migrating into v2
                    </Typography>
                    <Typography variant="subtitle1" color="textPrimary">
                        Press Migrate to migrate funds into V2
                    </Typography>
                </Grid>
                <Grid item>
                    
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
                            onMigrateClick={onMigrateClick}
                            onWithdrawClick={onWithdrawClick}
                            vaults={migrationStatus.scVaults}
                            type="lending" />
                    </Grid>
                    <Grid item>
                        <MigrateTable
                            onMigrateClick={onMigrateClick}
                            onWithdrawClick={onWithdrawClick}
                            vaults={migrationStatus.lpVaults}
                            type="borrowing" />
                    </Grid>
                </Grid>
            </Grid>
            {/* <WithdrawMigrateModal
                action={"Withdraw"}
                error={false}
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
            <RowModal
                action={"Withdraw Collateral"}
                error={false}
                handleClose={handleWithdrawCollateralClose}
                lp={1}
                onButtonClick={onWithdrawCollateral}
                onChange={onWithdrawCollateralAmountChange}
                onMaxButtonClick={onWithdrawMaxCollateral}
                open={withdrawCollateralModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
                value={withdrawCollateralAmountValue}
            />
            <MigrateModal
                action={"Migrate"}
                error={false}
                handleClose={handleMigrateClose}
                migrateDepositDisabled={migrateDepositDisabled}
                migrateWithdrawDisabled={migrateWithdrawDisabled}
                onDepositClick={onMigrateDeposit}
                onChange={onMigrateAmountChange}
                onMaxButtonClick={onWithdrawMax}
                open={migrateModalOpen}
                onWithdrawClick={onMigrateWithdraw}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
                value={migrateAmountValue}
            /> */}
            <TransactionModal
                action={"Transaction"}
                handleClose={handleTransactionModalClose}
                open={transactionModalOpen}
                confirmed={transactionSubmitted}
                txHash={transactionInfo.hash}
            />
        </React.Fragment>
    )
}