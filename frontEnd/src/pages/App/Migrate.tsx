import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Header, MigrateTable, SimpleModal, TransactionModal } from "../../components";
import { MigrationVault, useMigrationStatus } from "../../hooks/useMigrations";

import { BigNumber } from "ethers";
import { ERC20Service } from "../../services/erc20";
import { MigrateModal } from "../../components/modals/MigrateModal";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";
import { TransactionInfo } from "../../util/types";
import { V1WarpControlService } from "../../services/v1Control";
import { WarpControlService } from "../../services/warpControl";
import { WarpLPVaultService } from "../../services/warpLPVault";
import { formatBigNumber } from "../../util/tools";
import { getContractAddress } from "../../util/networks";
import { getLogger } from "../../util/logger";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useNotificationModal } from "../../hooks/useNotificationModal";

interface Props {
}

const logger = getLogger("Page::Migrate");

declare type MigrationState = "start" | "withdraw" | "approve" | "deposit" | "finish";

export const Migrate: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const { account, library: provider, networkId } = context
    const migrationStatus = useMigrationStatus();

    const {
        notify,
        notifyError,
        modal
    } = useNotificationModal();

    const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);


    const [migrationVault, setMigrationVault] = React.useState<Maybe<MigrationVault>>(null);

    // The quantity of tokens to display
    const [displayAmount, setDisplayAmount] = React.useState<string>("0");

    // The value (in USDC) of the displayed tokens to display
    const [displayValue, setDisplayValue] = React.useState<string>("0");

    const [migrationState, setMigrationState] = React.useState<MigrationState>("start");

    const [transactionSubmitted, setTransactionSubmitted] = React.useState<boolean>(false);
    const [transactionInfo, setTransactionInfo] = React.useState<TransactionInfo>({ hash: "" } as TransactionInfo);

    const [migrateModalOpen, setMigrateModalOpen] = React.useState(false);
    const [migrateDepositDisabled, setMigrateDepositDisabled] = React.useState(true);
    const [migrateWithdrawDisabled, setMigrateWithdrawDisabled] = React.useState(true);
    const [migrateApproveDisabled, setMigrateApproveDisabled] = React.useState(true);

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

    const getScVault = async (control: V1WarpControlService | WarpControlService, token: string) => {
        const vaultAddress = await control.getStableCoinVault(token);
        const vault = new StableCoinWarpVaultService(provider, account, vaultAddress);
        return vault;
    }

    const getLpVault = async (control: V1WarpControlService | WarpControlService, token: string) => {
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
        setDisplayValue(vault.value.toLocaleString(undefined, { maximumFractionDigits: 2 }));
        setMigrationVault(vault);
    }

    const onWithdrawClick = (vault: MigrationVault) => {
        setWithdrawModalOpen(true);
        setMigrationVaultStates(vault);
        logger.log(`Opening withdraw modal for ${vault.token.symbol}`);
        console.log(vault.token);
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
            logger.log(`max is ${max.toString()}`)
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
            tx = currentVault.provideCollateral(BigNumber.from(vault.amount));
        } else {
            const currentVault = await getCurrentScVault(vault.token.address);
            tx = currentVault.lendToVault(BigNumber.from(vault.amount));
        }

        const txInfo = await handleTransaction(tx);

        return txInfo;
    }

    /* 
        Triggered when the user hits the "Withdraw" button inside the Withdraw modal
    */
    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!migrationVault) {
            console.error(`no migration vault set!`);
            return;
        }

        let txInfo: Maybe<TransactionInfo> = null;
        try {
            txInfo = await withdrawFromV1(migrationVault);
        } catch (e) {
            notifyError(`Transaction failed to submit. Please try again later.`);
            logger.error(`Transaction failed!`);
            console.log(e);
            setTransactionModalOpen(false);
            return;
        }
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
        setMigrateApproveDisabled(true);
        setMigrateWithdrawDisabled(false);
        logger.log(`User is migrating ${vault.token.symbol}`);
    }

    /* 
        Triggered when the user hits the "Withdraw" button inside the Migrate modal
    */
    const onMigrateWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!migrationVault) {
            console.error(`no migration vault set!`);
            return;
        }

        let txInfo: Maybe<TransactionInfo> = null;
        try {
            txInfo = await withdrawFromV1(migrationVault);
        } catch (e) {
            notifyError(`Transaction failed to submit. Please try again later.`);
            logger.error(`Transaction failed!`);
            console.log(e);
            setTransactionModalOpen(false);
            return;
        }

        setMigrationState("withdraw");

        await txInfo.finished;
        setTransactionModalOpen(false);

        setMigrateDepositDisabled(true);
        setMigrateApproveDisabled(false);
        setMigrateWithdrawDisabled(true);
    }

    const onApproveClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!migrationVault) {
            console.error(`no migration vault set!`);
            return;
        }

        const vault = migrationVault;

        logger.log(`User is approving ${vault.token.symbol}`);

        handleStartTransaction();

        let tx: Maybe<Promise<TransactionInfo>> = null;
        if (vault.token.isLP) {
            const currentVault = await getCurrentLpVault(vault.token.address);
            const erc20 = new ERC20Service(provider, account, vault.token.address);
            tx = erc20.approveUnlimited(currentVault.contract.address);
        } else {
            const currentVault = await getCurrentScVault(vault.token.address);
            const erc20 = new ERC20Service(provider, account, vault.token.address);
            tx = erc20.approveUnlimited(currentVault.contract.address);
        }

        let txInfo: Maybe<TransactionInfo> = null;
        try {
            txInfo = await handleTransaction(tx);
        } catch (e) {
            notifyError(`Transaction failed to submit. Please try again later.`);
            logger.error(`Transaction failed!`);
            console.log(e);
            setTransactionModalOpen(false);
            return;
        }

        setMigrationState("approve");

        await txInfo.finished;
        setTransactionModalOpen(false);

        setMigrateDepositDisabled(false);
        setMigrateApproveDisabled(true);
        setMigrateWithdrawDisabled(true);
    }

    /* 
        Triggered when the user hits the "Deposit" button inside the Withdraw modal
    */
    const onMigrateDeposit = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!migrationVault) {
            console.error(`no migration vault set!`);
            return;
        }

        let txInfo: Maybe<TransactionInfo> = null;
        try {
            txInfo = await depositFromV1(migrationVault);
        } catch (e) {
            notifyError(`Transaction failed to submit. Please try again later.`);
            logger.error(`Transaction failed!`);
            console.log(e);
            setTransactionModalOpen(false);
            return;
        }
        setMigrationState("deposit");

        setMigrateDepositDisabled(true);
        setMigrateWithdrawDisabled(true);
        setMigrateApproveDisabled(true);

        await txInfo.finished;

        console.log(`User has successfully migrated ${migrationVault.token.symbol}`);

        setTransactionModalOpen(false);
        setMigrationState("finish");

        migrationStatus.refresh();
    }

    const handleMigrateClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        logger.log(`Close reason was ${reason}`)
        if (migrationState == "withdraw" || migrationState == "approve") {
            logger.log(`User is mid migration, ignoring close command`);
            return;
        }
        else {
            setMigrateModalOpen(false);
            setDisplayAmount("");
            setDisplayValue("");
        }

        migrationStatus.refresh();
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
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" color="textPrimary">
                        Press Migrate to migrate funds into V2
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
            <SimpleModal
                action="Withdraw"
                amount={displayAmount}
                currency={migrationVault?.token.symbol || 'token'}
                displayValue={displayValue}
                iconSrc={"token"}
                onButtonClick={onWithdraw}
                handleClose={handleWithdrawClose}
                open={withdrawModalOpen} />
            <MigrateModal
                action="Migrate"
                currency={migrationVault?.token.symbol || 'token'}
                displayValue={displayValue}
                error={false}
                handleClose={handleMigrateClose}
                iconSrcPrimary={"token"}
                iconSrcSecondary={"token"}
                onDepositClick={onMigrateDeposit}
                onWithdrawClick={onMigrateWithdraw}
                onApproveClick={onApproveClick}
                open={migrateModalOpen}
                loading={true}
                migrateDepositDisabled={migrateDepositDisabled}
                migrateWithdrawDisabled={migrateWithdrawDisabled}
                migrateApproveDisabled={migrateApproveDisabled}
                status={"loading..."}
                value={displayAmount}
            />
            <TransactionModal
                action={"Transaction"}
                handleClose={handleTransactionModalClose}
                open={transactionModalOpen}
                confirmed={transactionSubmitted}
                txHash={transactionInfo.hash}
            />
            {modal}
        </React.Fragment>
    )
}