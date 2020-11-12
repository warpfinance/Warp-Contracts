import * as React from "react";

import { AuthorizationModal, Header, InformationCard, LenderTable, SimpleModal, TransactionModal } from "../../components";
import { BigNumber, utils } from "ethers";

import { ERC20Service } from "../../services/erc20";
import { Grid } from "@material-ui/core";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";
import { Token } from "../../util/token";
import { formatBigNumber } from "../../util/tools";
import { useCombinedHistoricalReward } from "../../hooks/useCombinedHistoricalReward";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useState } from "react";
import { useTotalLentAmount } from "../../hooks/useTotalLentAmount";
import { useTotalWalletBalance } from "../../hooks/useTotalWalletBalance";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useWarpControl } from "../../hooks/useWarpControl";
import { TransactionInfo } from "../../util/types";
import { useRefreshToken } from "../../hooks/useRefreshToken";

interface Props {
}

export const Lender: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const {refreshToken, refresh} = useRefreshToken();
    const tokens = useStableCoinTokens(context);

    const walletBalance = useTotalWalletBalance(context, refreshToken);
    const { control } = useWarpControl(context);
    const usdcToken = useUSDCToken(context);
    const totalLentAmount = useTotalLentAmount(context, control, usdcToken, refreshToken);
    const totalReward = useCombinedHistoricalReward(context, control, tokens, usdcToken);

    const data = {
        stableCoinDeposit: totalLentAmount,
        stableCoinReward: totalReward,
        walletBalance
    }

    const [action, setAction] = useState("lend");
    const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);

    const [lendToken, setLendToken] = React.useState<Maybe<Token>>(null);
    const [lendAmountCurrency, setLendAmountCurrency] = React.useState("");
    const [lendAmountValue, setLendAmountValue] = React.useState(BigNumber.from(0));
    const [lendFocusedAmountId, setLendFocusedAmountId] = React.useState("");
    const [lendMaxAmount, setLendMaxAmount] = React.useState(BigNumber.from(0));

    const [withdrawToken, setWithdrawToken] = React.useState<Maybe<Token>>(null);
    const [withdrawAmountCurrency, setWithdrawAmountCurrency] = React.useState("");
    const [withdrawAmountValue, setWithdrawAmountValue] = React.useState(BigNumber.from(0));
    const [withdrawFocusedAmountId, setWithdrawFocusedAmountId] = React.useState("");
    const [withdrawMaxAmount, setWithdrawMaxAmount] = React.useState(BigNumber.from(0));

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
            setLendError(isError(lendAmountValue, lendAmountCurrency, tokens, lendMaxAmount));
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
        if (value.lt(BigNumber.from(0)) || value.gt(maxValue)) {
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
        setLendAmountValue(utils.parseUnits(event.target.value || "0", token.decimals));
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
        setWithdrawAmountValue(utils.parseUnits(event.target.value || "0", token.decimals));
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

    const handleTransaction = async (tx: Promise<TransactionInfo>) =>{
        setTransactionConfirmed(false);
        setTransactionModalOpen(true);
        const info = await tx;
        setTransactionConfirmed(true);
        setTransactionHash(info.hash);

        
        await info.finished;
        setTransactionModalOpen(false);
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
        
        await handleTransaction(tx);
        refresh();
    }

    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!withdrawToken || !context.account) {
            return;
        }

        setAction("withdraw");
        const erc20 = new ERC20Service(context.library, context.account, withdrawToken.address);
        const targetVault = await control.getStableCoinVault(withdrawToken.address);
        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

        const tx = scVault.withdraw(withdrawAmountValue);

        setWithdrawModalOpen(false);
        
        await handleTransaction(tx);
        refresh();
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
                        <InformationCard header="Wallet balance" text={`$${data.walletBalance}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Stable coin reward" text={`$${data.stableCoinReward}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Stable coin deposit" text={`$${data.stableCoinDeposit.toFixed(2)}`} />
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
                            type="withdraw" />
                    </Grid>
                </Grid>
            </Grid >
            <SimpleModal
                action="Lend"
                amount={lendToken ? formatBigNumber(lendAmountValue, lendToken.decimals) : '0'}
                currency={lendAmountCurrency}
                iconSrc={`${lendAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onLend}
                handleClose={handleLendClose}
                open={lendModalOpen} />
            <SimpleModal
                action="Withdraw"
                amount={withdrawToken ? formatBigNumber(withdrawAmountValue, withdrawToken.decimals) : '0'}
                currency={withdrawAmountCurrency}
                iconSrc={`${withdrawAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onWithdraw}
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
        </React.Fragment>
    );
}
