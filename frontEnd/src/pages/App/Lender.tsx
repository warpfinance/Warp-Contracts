import * as React from "react";

import { AuthorizationModal, Header, InformationCard, LenderTable, SimpleModal } from "../../components";
import { Avatar, Grid } from "@material-ui/core";

import { useState } from "react";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { Token } from "../../util/token";
import { useWalletTokenBalance } from "../../hooks/useWalletBalance";
import { BigNumber, utils} from "ethers";
import { formatBigNumber } from "../../util/tools";

// TO-DO: Web3 integration
const authAction = "lend"
const data = {
    stableCoinDeposit: 0.00,
    stableCoinReward: 4545,
    walletBalance: 656
}

interface Props {
}


export const Lender: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const tokens = useStableCoinTokens(context);

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

    const onAuth = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAuthorizationModalOpen(false);
        // TO-DO: Web3 integration
    }

    const onLend = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setLendModalOpen(false);
        // TO-DO: Web3 integration
        const lendAuthorization = false;
        if (lendAuthorization === false) {
            setAuthorizationModalOpen(true);
        }
    }

    const onWithdraw = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(false);
        // TO-DO: Web3 integration
    }

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={5}
            >
                <Header connected={true} />
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Grid item>
                        <InformationCard header="Stable coin deposit" text={`$${data.stableCoinDeposit.toFixed(2)}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Stable coin reward" text={`$${data.stableCoinReward}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Wallet balance" text={`$${data.walletBalance}`} />
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
                        <LenderTable amountCurrency={lendAmountCurrency}
                            amountValue={lendAmountValue}
                            data={tokens}
                            error={lendError}
                            focusedAmountId={lendFocusedAmountId}
                            onBlur={onLendBlur}
                            onButtonClick={onLendClick}
                            onChange={onLendAmountChange}
                            onFocus={onLendFocus}
                            type="lend" />
                    </Grid>
                    <Grid item>
                        <LenderTable amountCurrency={withdrawAmountCurrency}
                            amountValue={withdrawAmountValue}
                            data={tokens}
                            error={withdrawError}
                            focusedAmountId={withdrawFocusedAmountId}
                            onBlur={onWithdrawBlur}
                            onButtonClick={onWithdrawClick}
                            onChange={onWithdrawAmountChange}
                            onFocus={onWithdrawFocus}
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
                action={authAction}
                handleClose={handleAuthClose}
                onButtonClick={onAuth}
                open={authorizationModalOpen}
            />
        </React.Fragment>
    );
}
