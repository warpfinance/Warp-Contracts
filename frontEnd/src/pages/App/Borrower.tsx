import * as React from "react";

import { Avatar, Grid } from "@material-ui/core";
import { BigModal, BorrowerTable, Header, InformationCard, RowModal } from "../../components";

import { AvatarGroup } from "@material-ui/lab";
import { useState } from "react";

interface Props {

}

const data = {
    collateral: 123.00,
    interestRate: 1.97,
}

//@ts-ignore
function createBorrowData(icon, name, supplyShare, amount, currency, lp, lpCurrency) {
    return { icon, name, supplyShare, amount, currency, lp, lpCurrency };
}

//@ts-ignore
function createRepayData(icon, amount, currency) {
    return { icon, amount, currency, };
}

const borrowData = [
    createBorrowData(<AvatarGroup max={2}><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"dai.png"} src={"dai.png"} /></AvatarGroup>,
        "ETH - DAI", 1.97, 765, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"usdt.png"} src={"usdt.png"} /></AvatarGroup>,
        "ETH - USDT", 3.25, 345, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"wbtc.png"} src={"wbtc.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "wBTC - wETH", 1.32, 765, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"usdt.png"} src={"usdt.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "USDT - wETH", 2.18, 456, "USD", 400, "LP"),
];

const repayData = [
    createRepayData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createRepayData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 249, "USDT"),
    createRepayData(<Avatar alt={"usdc.png"} src={"usdc.png"} />, 68, "USDC"),
];

export const Borrower: React.FC<Props> = (props: Props) => {
    const [borrowAmountCurrency, setBorrowAmountCurrency] = React.useState("");
    const [borrowAmountValue, setBorrowAmountValue] = React.useState(0);
    const [borrowFocusedAmountId, setBorrowFocusedAmountId] = React.useState("");
    const [repayAmountCurrency, setRepayAmountCurrency] = React.useState("");
    const [repayAmountValue, setRepayAmountValue] = React.useState(0);
    const [repayFocusedAmountId, setRepayFocusedAmountId] = React.useState("");
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);
    const [borrowError, setBorrowError] = useState(false);
    const [repayError, setRepayError] = useState(false);

    React.useEffect(() => {
        if (borrowAmountValue !== 0 && borrowAmountCurrency !== "") {
            setBorrowError(isBorrowError(borrowAmountValue, borrowAmountCurrency));
        }
        if (repayAmountValue !== 0 && repayAmountCurrency !== "") {
            setRepayError(isRepayError(repayAmountValue, repayAmountCurrency));
        }
    }, [borrowAmountValue, borrowAmountCurrency, repayAmountValue, repayAmountCurrency]
    );

    const handleBorrowClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setBorrowModalOpen(false);
    }

    const handleRepayClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setRepayModalOpen(false);
    }

    const isBorrowError = (value: any, currency: string) => {
        const index = borrowData.findIndex((value: any) => value.currency === currency);
        if (index < 0) return true;
        if (value <= 0 ||
            value > borrowData[index].amount) {
            return true;
        }
        return false;
    }

    const isRepayError = (value: any, currency: string) => {
        const index = repayData.findIndex((value: any) => value.currency === currency);
        if (index < 0) return true;
        if (value <= 0 ||
            value > repayData[index].amount) {
            return true;
        }
        return false;
    }

    const onBorrowClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setBorrowModalOpen(true);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setRepayModalOpen(true);
    }

    const onBorrowAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBorrowAmountCurrency(event.target.id);
        setBorrowFocusedAmountId(event.target.id);
        setBorrowAmountValue(Number(event.target.value));
    };

    const onBorrowBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (borrowAmountValue === 0) {
            setBorrowFocusedAmountId("");
        }
    };

    const onBorrowFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && borrowFocusedAmountId !== event.target.id) {
            setBorrowFocusedAmountId(event.target.id);
        }
    };

    const onRepayAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRepayFocusedAmountId(event.target.id)
        setRepayAmountCurrency(event.target.id);
        setRepayAmountValue(Number(event.target.value));
    };

    const onRepayBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (repayAmountValue === 0) {
            setRepayFocusedAmountId("");
        }
    };

    const onRepayFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && repayFocusedAmountId !== event.target.id) {
            setRepayFocusedAmountId(event.target.id);
        }
    };

    const onBorrow = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onRepay = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
                        <InformationCard header="Collateral" text={`$${data.collateral.toFixed(2)}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Interest rate" text={`${data.interestRate.toFixed(2)}%`} />
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
                        <BorrowerTable amountCurrency={borrowAmountCurrency}
                            amountValue={borrowAmountValue}
                            data={borrowData}
                            error={borrowError}
                            focusedAmountId={borrowFocusedAmountId}
                            onBlur={onBorrowBlur}
                            onButtonClick={onBorrowClick}
                            onChange={onBorrowAmountChange}
                            onFocus={onBorrowFocus}
                            type="borrow" />
                    </Grid>
                    <Grid item>
                        <BorrowerTable amountCurrency={repayAmountCurrency}
                            amountValue={repayAmountValue}
                            data={repayData}
                            error={repayError}
                            focusedAmountId={repayFocusedAmountId}
                            onBlur={onRepayBlur}
                            onButtonClick={onRepayClick}
                            onChange={onRepayAmountChange}
                            onFocus={onRepayFocus}
                            type="repay" />
                    </Grid>
                </Grid>
            </Grid >
            <BigModal
                action="Borrow"
                amount={100}
                currency="DAI"
                onButtonClick={onBorrow}
                handleClose={handleBorrowClose}
                open={borrowModalOpen} />
            <RowModal
                action="Repay"
                amount={100}
                amountCurrency="DAI"
                amountIconSrc="dai.png"
                onButtonClick={onRepay}
                handleClose={handleRepayClose}
                reward={100}
                rewardCurrency="LP"
                rewardIconSrcPrimary="eth.png"
                rewardIconSrcSecondary="dai.png"
                open={repayModalOpen} />
        </React.Fragment>
    );
}