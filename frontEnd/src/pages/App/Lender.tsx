import * as React from "react";

import { AuthorizationModal, Header, InformationCard, LenderTable, SimpleModal, TransactionModal } from "../../components";
import { BigNumber, utils } from "ethers";
import { countDecimals, formatBigNumber } from "../../util/tools";

import { ERC20Service } from "../../services/erc20";
import { Grid, makeStyles } from "@material-ui/core";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";
import { Token } from "../../util/token";
import { TransactionInfo } from "../../util/types";
import { getLogger } from "../../util/logger";
import { isAddress } from "ethers/lib/utils";
import { useCombinedHistoricalReward } from "../../hooks/useCombinedHistoricalReward";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useState } from "react";
import { useTotalLentAmount } from "../../hooks/useTotalLentAmount";
import { useTotalWalletBalance } from "../../hooks/useTotalWalletBalance";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useWarpControl } from "../../hooks/useWarpControl";
import { useNotificationModal } from "../../hooks/useNotificationModal";

interface Props {
}

const logger = getLogger("Pages::Lender");

const useStyles = makeStyles(theme => ({
    lenderRow: {
        height: "110px"
    },
}));

export const Lender: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const context = useConnectedWeb3Context();
    const { refreshToken, refresh } = useRefreshToken();
    const tokens = useStableCoinTokens(context);
    const { control } = useWarpControl(context);
    const usdcToken = useUSDCToken(context);

    const walletBalance = useTotalWalletBalance(context, control, usdcToken, refreshToken);

    const totalLentAmount = useTotalLentAmount(context, control, usdcToken, refreshToken);
    const totalReward = useCombinedHistoricalReward(context, control, tokens, usdcToken);

    const data = {
        stableCoinDeposit: totalLentAmount,
        stableCoinReward: totalReward,
        walletBalance: walletBalance.toLocaleString(undefined, {maximumFractionDigits: 2})
    }

    const {
        notify,
        notifyError,
        modal
    } = useNotificationModal();

    const [action, setAction] = useState("lend");
    const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);

    const [lendToken, setLendToken] = useState<Maybe<Token>>(null);
    const [lendAmountCurrency, setLendAmountCurrency] = useState("");
    const [lendAmountValue, setLendAmountValue] = useState(BigNumber.from(0));
    const [lendFocusedAmountId, setLendFocusedAmountId] = useState("");
    const [lendMaxAmount, setLendMaxAmount] = useState(BigNumber.from(0));

    const [withdrawToken, setWithdrawToken] = useState<Maybe<Token>>(null);
    const [withdrawAmountCurrency, setWithdrawAmountCurrency] = useState("");
    const [withdrawAmountValue, setWithdrawAmountValue] = useState(BigNumber.from(0));
    const [withdrawFocusedAmountId, setWithdrawFocusedAmountId] = useState("");
    const [withdrawMaxAmount, setWithdrawMaxAmount] = useState(BigNumber.from(0));

    const [lendModalOpen, setLendModalOpen] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [lendError, setLendError] = useState(false);
    const [withdrawError, setWithdrawError] = useState(false);

    // TO-DO: Web3 integration
    const [transactionHash, setTransactionHash] = useState("0x716af84c2de1026e87ec2d32df563a6e7e43b261227eb10358ba3d8dd372eceb");
    const [transactionConfirmed, setTransactionConfirmed] = useState(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    React.useEffect(() => {
        if (!lendAmountValue.eq(BigNumber.from(0)) && lendAmountCurrency !== "") {
            setLendError(isError(lendAmountValue, lendAmountCurrency, tokens,  lendMaxAmount));
        }
        if (!withdrawAmountValue.eq(BigNumber.from(0)) && withdrawAmountCurrency !== "") {
            setWithdrawError(isError(withdrawAmountValue, withdrawAmountCurrency, tokens, withdrawMaxAmount));
        }
    }, [lendAmountValue, lendAmountCurrency, withdrawAmountValue, withdrawAmountCurrency]
    );

    const handleAuthClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setAuthorizationModalOpen(false);
    }

    const handleLendClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setLendModalOpen(false);
    }

    const handleTransactClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTransactionModalOpen(false);
    }

    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
    }

    const isError = (value: BigNumber, symbol: string, tokens: Token[], maxValue: BigNumber) => {
        const index = tokens.findIndex((value: Token) => value.symbol === symbol);
        if (index < 0) return true;
        if (value.lte(BigNumber.from(0)) || value.gt(maxValue)) {
            return true;
        }
        return false;
    }

    const onLendClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setLendModalOpen(true);
    }

    const onWithdrawClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(true);
    }

    const onLendAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, maxAmount: BigNumber, token: Token) => {
        setLendAmountCurrency(event.target.id);
        setLendFocusedAmountId(event.target.id);
        

        let amount = event.target.value || "0";
        if (countDecimals(amount) > 3) {
            amount = "0";
        }

        setLendAmountValue(utils.parseUnits(amount, token.decimals));
        logger.log("On lend amount change", lendAmountCurrency, lendFocusedAmountId, event.target.value || "0", token.symbol, amount)
        setLendMaxAmount(maxAmount);
        setLendToken(token);
    };

    const onLendBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (lendAmountValue.eq(BigNumber.from(0))) {
            setLendFocusedAmountId("");
        }
    };

    const onLendFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && lendFocusedAmountId !== event.target.id) {
            setLendFocusedAmountId(event.target.id);
        }
    };

    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, maxAmount: BigNumber, token: Token) => {
        setWithdrawFocusedAmountId(event.target.id)
        setWithdrawAmountCurrency(event.target.id);

        let amount = event.target.value || "0";
        if (countDecimals(amount) > 3) {
            amount = "0";
        }

        setWithdrawAmountValue(utils.parseUnits(amount, token.decimals));
        setWithdrawMaxAmount(maxAmount);
        setWithdrawToken(token);
    };

    const onWithdrawBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (withdrawAmountValue.eq(BigNumber.from(0))) {
            setWithdrawFocusedAmountId("");
        }
    };

    const onWithdrawFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && withdrawFocusedAmountId !== event.target.id) {
            setWithdrawFocusedAmountId(event.target.id);
        }
    };

    const handleTransaction = async (tx: Promise<TransactionInfo>) => {
        try {
            setTransactionConfirmed(false);
            setTransactionModalOpen(true);
            const info = await tx;
            setTransactionConfirmed(true);
            setTransactionHash(info.hash);
            await info.finished;
            setTransactionModalOpen(false);
        } catch(e) {
            let reason = `${e.message}`;
            if (e.data) {
                reason += `\n${e.data.message}`;
            }
            logger.error(`\nTransaction Failed!  Reason:\n${reason}`);
            notifyError("Transaction failed to submit. Please try again later.");
            setTransactionModalOpen(false);
        }
    }

    const onAuth = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!lendToken) {
            return;
        }

        const erc20 = new ERC20Service(context.library, context.account, lendToken.address);
        const targetVault = await control.getStableCoinVault(lendToken.address);

        const tx = erc20.approveUnlimited(targetVault);
        setAuthorizationModalOpen(false);
        await handleTransaction(tx);

        setLendModalOpen(true);
    }

    const onLend = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!lendToken || !context.account) {
            return;
        }

        setAction("lend");
        const erc20 = new ERC20Service(context.library, context.account, lendToken.address);
        const targetVault = await control.getStableCoinVault(lendToken.address);
        const enabledAmount = await erc20.allowance(context.account, targetVault);

        const needsAuth = lendAmountValue.gt(enabledAmount);

        if (needsAuth) {
            setAuthorizationModalOpen(true);
            return;
        }

        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

        const tx = scVault.lendToVault(lendAmountValue);

        setLendModalOpen(false);

        setWithdrawFocusedAmountId("");
        setWithdrawAmountValue(BigNumber.from(0));
        setLendFocusedAmountId("");
        setLendAmountValue(BigNumber.from(0));

        await handleTransaction(tx);
        refresh();
    }

    const onLendMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setLendAmountValue(lendMaxAmount);
    }

    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!withdrawToken || !context.account) {
            return;
        }

        setAction("withdraw");
        const targetVault = await control.getStableCoinVault(withdrawToken.address);
        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

        const erc20 = new ERC20Service(context.library, context.account, withdrawToken.address);

        const cash = await erc20.balanceOf(targetVault);

        if (withdrawAmountValue.gt(cash)) {
            notifyError(`You are trying to withdraw more ${withdrawToken.symbol} than the vault has as available liquidity. At most you can withdraw up to ${formatBigNumber(cash, withdrawToken.decimals, 2)} ${withdrawToken.symbol}.`, 'Withdrawing too much');
            return;
        }

        const tx = scVault.withdraw(withdrawAmountValue);

        setWithdrawModalOpen(false);

        setWithdrawFocusedAmountId("");
        setWithdrawAmountValue(BigNumber.from(0));
        setLendFocusedAmountId("");
        setLendAmountValue(BigNumber.from(0));

        await handleTransaction(tx);
        refresh();
    }

    const onWithdrawMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawAmountValue(withdrawMaxAmount);
    }

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={5}
            >
                <Header />
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Grid item>
                        <InformationCard header="Wallet balance (in USDC)" text={`$${data.walletBalance}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Stable coin reward (in USDC)" text={`$${data.stableCoinReward.toLocaleString(undefined, {maximumFractionDigits: 2})}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Stable coin deposit (in USDC)" text={`$${data.stableCoinDeposit.toFixed(2)}`} />
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
                        <LenderTable amountCurrency={lendAmountCurrency}
                            amountValue={lendAmountValue}
                            data={tokens}
                            error={lendError}
                            focusedAmountId={lendFocusedAmountId}
                            onBlur={onLendBlur}
                            onButtonClick={onLendClick}
                            onChange={onLendAmountChange}
                            onFocus={onLendFocus}
                            refreshToken={refreshToken}
                            rowClass={classes.lenderRow}
                            type="lend" />
                    </Grid>
                    <Grid item sm>
                        <LenderTable amountCurrency={withdrawAmountCurrency}
                            amountValue={withdrawAmountValue}
                            data={tokens}
                            error={withdrawError}
                            focusedAmountId={withdrawFocusedAmountId}
                            onBlur={onWithdrawBlur}
                            onButtonClick={onWithdrawClick}
                            onChange={onWithdrawAmountChange}
                            onFocus={onWithdrawFocus}
                            refreshToken={refreshToken}
                            rowClass={classes.lenderRow}
                            type="withdraw" />
                    </Grid>
                </Grid>
            </Grid >
            <SimpleModal
                action="Lend"
                amount={lendToken ? formatBigNumber(lendAmountValue, lendToken.decimals) : '0'}
                currency={lendAmountCurrency}
                handleClose={handleLendClose}
                iconSrc={`${lendAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onLend}
                onMaxButtonClick={onLendMax}
                open={lendModalOpen}
            />
            <SimpleModal
                action="Withdraw"
                amount={withdrawToken ? formatBigNumber(withdrawAmountValue, withdrawToken.decimals) : '0'}
                currency={withdrawAmountCurrency}
                iconSrc={`${withdrawAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onWithdraw}
                onMaxButtonClick={onWithdrawMax}
                handleClose={handleWithdrawClose}
                open={withdrawModalOpen} />
            <AuthorizationModal
                action={action}
                handleClose={handleAuthClose}
                onButtonClick={onAuth}
                open={authorizationModalOpen}
            />
            <TransactionModal
                action={action}
                confirmed={transactionConfirmed}
                handleClose={handleTransactClose}
                open={transactionModalOpen}
                txHash={transactionHash || ""}
            />
            {modal}
        </React.Fragment>
    );
}
