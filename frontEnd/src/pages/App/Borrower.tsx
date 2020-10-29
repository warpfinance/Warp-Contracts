import * as React from "react";

import { Avatar, Grid } from "@material-ui/core";
import { BigModal, BorrowerTable, Header, InformationCard, RowModal } from "../../components";

import { AvatarGroup } from "@material-ui/lab";
import { useState } from "react";

interface Props {

}

const data = {
    collateral: 123.00,
    borrowPercentage: 10, 
    interestRate: 1.97,
}

//@ts-ignore
function createCollateralData(icon, pool, available, provided, currency, availableLp, providedLp, lpCurrency) {
    return { icon, pool, available, provided, currency, availableLp, providedLp, lpCurrency };
}

//@ts-ignore
function createBorrowData(icon, amount, currency) {
    return { icon, amount, currency, };
}

const collateralData = [
    createCollateralData(<AvatarGroup max={2}><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"dai.png"} src={"dai.png"} /></AvatarGroup>,
        "ETH - DAI", 765, 765, "USD", 400, 400, "LP"),
    createCollateralData(<AvatarGroup><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"usdt.png"} src={"usdt.png"} /></AvatarGroup>,
        "ETH - USDT", 345, 345, "USD", 400, 400, "LP"),
    createCollateralData(<AvatarGroup><Avatar alt={"wbtc.png"} src={"wbtc.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "wBTC - wETH", 765, 765, "USD", 400, 400, "LP"),
    createCollateralData(<AvatarGroup><Avatar alt={"usdt.png"} src={"usdt.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "USDT - wETH", 456, 456, "USD", 400, 400, "LP"),
];

const borrowData = [
    createBorrowData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createBorrowData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 249, "USDT"),
    createBorrowData(<Avatar alt={"usdc.png"} src={"usdc.png"} />, 68, "USDC"),
];

export const Borrower: React.FC<Props> = (props: Props) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [collateralAmountCurrency, setCollateralAmountCurrency] = React.useState("DAI");
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [collateralAmountPool, setCollateralAmountPool] = React.useState("");
    const [collateralAmountValue, setCollateralAmountValue] = React.useState(0);
    const [collateralFocusedAmountId, setCollateralFocusedAmountId] = React.useState("");
    const [borrowAmountCurrency, setBorrowAmountCurrency] = React.useState("");
    const [borrowAmountValue, setBorrowAmountValue] = React.useState(0);
    const [borrowFocusedAmountId, setBorrowFocusedAmountId] = React.useState("");
    const [collateralModalOpen, setCollateralModalOpen] = useState(false);
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);
    const [collateralError, setCollateralError] = useState(false);
    const [borrowError, setBorrowError] = useState(false);

    React.useEffect(() => {
        if (collateralAmountValue !== 0 && collateralAmountPool !== "") {
            setCollateralError(isCollateralError(collateralAmountValue, collateralAmountPool));
        }
        if (borrowAmountValue !== 0 && borrowAmountCurrency !== "") {
            setBorrowError(isBorrowError(borrowAmountValue, borrowAmountCurrency));
        }
    }, [collateralAmountValue, collateralAmountPool, borrowAmountValue, borrowAmountCurrency]
    );

    const handleCollateralClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setCollateralModalOpen(false);
    }

    const handleBorrowClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setBorrowModalOpen(false);
    }

    const isCollateralError = (value: any, currency: string) => {
        const index = collateralData.findIndex((value: any) => value.currency === currency);
        if (index < 0) return true;
        if (value <= 0 /*||
            value > collateralData[index].amount*/) {
            return true;
        }
        return false;
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

    const onCollateralClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setCollateralModalOpen(true);
    }

    const onBorrowClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setBorrowModalOpen(true);
    }

    const onCollateralAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCollateralAmountPool(event.target.id);
        setCollateralFocusedAmountId(event.target.id);
        setCollateralAmountValue(Number(event.target.value));
    };

    const onCollateralBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (collateralAmountValue === 0) {
            setCollateralFocusedAmountId("");
        }
    };

    const onCollateralFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(event.target.id)
        if (event !== null && event !== undefined && collateralFocusedAmountId !== event.target.id) {
            setCollateralFocusedAmountId(event.target.id);
        }
    };

    const onBorrowAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBorrowFocusedAmountId(event.target.id)
        setBorrowAmountCurrency(event.target.id);
        setBorrowAmountValue(Number(event.target.value));
    };

    const onBorrowBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (borrowAmountValue === 0) {
            setBorrowFocusedAmountId("");
        }
    };

    const onBorrowFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(event.target.id)
        if (event !== null && event !== undefined && borrowFocusedAmountId !== event.target.id) {
            setBorrowFocusedAmountId(event.target.id);
        }
    };

    const handleCollateralSelect = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: string;
    }>, child: React.ReactNode) => {
        setCollateralAmountCurrency(event.target.value);
    };

    const onCollateral = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    }

    const onBorrow = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
                        <InformationCard header="Borrow %" text={`${data.borrowPercentage.toFixed(0)}%`} />
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
                        <BorrowerTable amountCurrency={collateralAmountPool}
                            amountValue={collateralAmountValue}
                            data={collateralData}
                            error={collateralError}
                            focusedAmountId={collateralFocusedAmountId}
                            onBlur={onCollateralBlur}
                            onButtonClick={onCollateralClick}
                            onChange={onCollateralAmountChange}
                            onFocus={onCollateralFocus}
                            type="collateral" />
                    </Grid>
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
                </Grid>
            </Grid >
            <BigModal
                action="Collateral"
                amount={collateralAmountValue}
                currency="DAI"
                handleClose={handleCollateralClose}
                handleSelect={handleCollateralSelect}
                onButtonClick={onCollateral}
                open={collateralModalOpen} />
            <RowModal
                action="Borrow"
                amount={borrowAmountValue}
                amountCurrency={borrowAmountCurrency}
                amountIconSrc={`${borrowAmountCurrency.toLowerCase()}.png`}
                onButtonClick={onBorrow}
                handleClose={handleBorrowClose}
                reward={100}
                rewardCurrency="LP"
                rewardIconSrcPrimary="eth.png"
                rewardIconSrcSecondary={`${borrowAmountCurrency.toLowerCase()}.png`}
                open={borrowModalOpen} />
        </React.Fragment>
    );
}