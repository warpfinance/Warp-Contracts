import * as React from "react";

import { Header, InformationCard, LenderTable, SimpleModal } from "../../components";

import { Grid } from "@material-ui/core";
import { useState } from "react";

const data = {
    stableCoinDeposit: 0.00,
    stableCoinReward: 4545,
    walletBalance: 656
}

interface Props {
}

export const Lender: React.FC<Props> = (props: Props) => {
    const [lendAmountCurrency, setLendAmountCurrency] = React.useState("");
    const [lendAmountValue, setLendAmountValue] = React.useState(0);
    const [lendFocusedAmountId, setLendFocusedAmountId] = React.useState("");
    const [withdrawAmountCurrency, setWithdrawAmountCurrency] = React.useState("");
    const [withdrawAmountValue, setWithdrawAmountValue] = React.useState(0);
    const [withdrawFocusedAmountId, setWithdrawFocusedAmountId] = React.useState("");
    const [lendModalOpen, setLendModalOpen] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const handleLendClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setLendModalOpen(false);
    }

    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
    }

    const onLendClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setLendModalOpen(true);
    }

    const onWithdrawClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawModalOpen(true);
    }

    const onLendAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // TO-DO: Input validation
        setLendAmountCurrency(event.target.id);
        setLendAmountValue(Number(event.target.value));
        setLendFocusedAmountId(event.target.id);
    };

    const onLendBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (lendAmountValue === 0) {
            setLendFocusedAmountId("");
        }
    };

    const onLendFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && lendFocusedAmountId !== event.target.id) {
            setLendFocusedAmountId(event.target.id);
        }
    };

    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // TO-DO: Input validation
        setWithdrawAmountCurrency(event.target.id);
        setWithdrawAmountValue(Number(event.target.value));
        setWithdrawFocusedAmountId(event.target.id);
    };

    const onWithdrawBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (withdrawAmountValue === 0) {
            setWithdrawFocusedAmountId("");
        }
    };

    const onWithdrawFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && withdrawFocusedAmountId !== event.target.id) {
            setWithdrawFocusedAmountId(event.target.id);
        }
    };

    const onLend = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onWithdraw = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
                amount={lendAmountValue}
                currency={lendAmountCurrency}
                iconSrc={`${lendAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onLend}
                handleClose={handleLendClose}
                open={lendModalOpen} />
            <SimpleModal
                action="Withdraw"
                amount={withdrawAmountValue}
                currency={withdrawAmountCurrency}
                iconSrc={`${withdrawAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onWithdraw}
                handleClose={handleWithdrawClose}
                open={withdrawModalOpen} />
        </React.Fragment>
    );
}
