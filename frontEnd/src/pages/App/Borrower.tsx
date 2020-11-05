import * as React from "react";

import { AmountModal, AuthorizationModal, BigModal, BorrowerTable, Header, InformationCard, RowModal } from "../../components";
import { Avatar, Grid } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import { useState } from "react";

interface Props {

}

// TO-DO: Web3 integration
const data = {
    collateral: 123.00,
    borrowPercentage: 10,
    interestRate: 1.97,
    borrowLimit: 200,
    borrowLimitUsed: 50,
}

const currencyIcons: any = {
    "DAI": "dai.png",
    "USDT": "usdt.png",
    "USDC": "usdc.png",
}

const poolIcons: any = {
    "ETH - DAI": { primarySrc: "eth.png", secondarySrc: "dai.png" },
    "ETH - USDT": { primarySrc: "eth.png", secondarySrc: "usdt.png" },
    "ETH - USDC": { primarySrc: "eth.png", secondarySrc: "usdc.png" },
    "ETH - WBTC": { primarySrc: "eth.png", secondarySrc: "wbtc.png" },
}

//@ts-ignore
function createWithdrawData(icon, pool, available, provided, currency, availableLp, providedLp, lpCurrency) {
    return { icon, pool, available, provided, currency, availableLp, providedLp, lpCurrency };
}

//@ts-ignore
function createBorrowData(icon, amount, currency) {
    return { icon, amount, currency, };
}

// TO-DO: Web3 integration
const collateralData = [
    createWithdrawData(<AvatarGroup max={2}><Avatar alt={poolIcons["ETH - DAI"].primarySrc} src={poolIcons["ETH - DAI"].primarySrc} />
        <Avatar alt={poolIcons["ETH - DAI"].secondarySrc} src={poolIcons["ETH - DAI"].secondarySrc} /></AvatarGroup>,
        "ETH - DAI", 765, 765, "USD", 400, 400, "LP"),
    createWithdrawData(<AvatarGroup max={2}><Avatar alt={poolIcons["ETH - USDT"].primarySrc} src={poolIcons["ETH - USDT"].primarySrc} />
        <Avatar alt={poolIcons["ETH - USDT"].secondarySrc} src={poolIcons["ETH - USDT"].secondarySrc} /></AvatarGroup>,
        "ETH - USDT", 345, 345, "USD", 400, 400, "LP"),
    createWithdrawData(<AvatarGroup max={2}><Avatar alt={poolIcons["ETH - USDC"].primarySrc} src={poolIcons["ETH - USDC"].primarySrc} />
        <Avatar alt={poolIcons["ETH - USDC"].secondarySrc} src={poolIcons["ETH - USDC"].secondarySrc} /></AvatarGroup>,
        "ETH - USDC", 765, 765, "USD", 400, 400, "LP"),
    createWithdrawData(<AvatarGroup max={2}><Avatar alt={poolIcons["ETH - WBTC"].primarySrc} src={poolIcons["ETH - WBTC"].primarySrc} />
        <Avatar alt={poolIcons["ETH - WBTC"].secondarySrc} src={poolIcons["ETH - WBTC"].secondarySrc} /></AvatarGroup>,
        "ETH - WBTC", 456, 456, "USD", 400, 400, "LP"),
];

// TO-DO: Web3 integration
const borrowData = [
    createBorrowData(<Avatar alt={currencyIcons["DAI"]} src={currencyIcons["DAI"]} />, 100, "DAI"),
    createBorrowData(<Avatar alt={currencyIcons["USDT"]} src={currencyIcons["USDT"]} />, 249, "USDT"),
    createBorrowData(<Avatar alt={currencyIcons["USDC"]} src={currencyIcons["USDC"]} />, 68, "USDC"),
];

export const Borrower: React.FC<Props> = (props: Props) => {
    const [authAction, setAuthAction] = useState("borrow");
    const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);
    const [borrowAmountCurrency, setBorrowAmountCurrency] = React.useState("DAI");
    const [borrowAmountValue, setBorrowAmountValue] = React.useState(0);
    const [borrowError, setBorrowError] = useState(false);
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);
    const [provideAmountValue, setProvideAmountValue] = React.useState(0);
    const [provideError, setProvideError] = useState(false);
    const [provideLpValue, setProvideLpValue] = React.useState(0);
    const [provideModalOpen, setProvideModalOpen] = useState(false);
    const [providePool, setProvidePool] = React.useState("");
    const [repayAmountCurrency, setRepayAmountCurrency] = React.useState("DAI");
    const [repayAmountValue, setRepayAmountValue] = React.useState(0);
    const [repayError, setRepayError] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);
    const [withdrawAmountValue, setWithdrawAmountValue] = React.useState(0);
    const [withdrawError, setWithdrawError] = useState(false);
    const [withdrawLpValue, setWithdrawLpValue] = React.useState(0);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawPool, setWithdrawPool] = React.useState("");

    React.useEffect(() => {
        if (borrowAmountValue !== 0 && borrowAmountCurrency !== "") {
            setBorrowError(isBorrowError(borrowAmountValue, borrowAmountCurrency));
        }
        if (provideAmountValue !== 0 && providePool !== "") {
            setProvideError(isProvideError(provideAmountValue, providePool));
        }
        if (repayAmountValue !== 0 && repayAmountCurrency !== "") {
            setRepayError(isRepayError(repayAmountValue, repayAmountCurrency));
        }
        if (withdrawAmountValue !== 0 && withdrawPool !== "") {
            setWithdrawError(isWithdrawError(withdrawAmountValue, withdrawPool));
        }
    }, [borrowAmountValue, borrowAmountCurrency,
        provideAmountValue, providePool,
        repayAmountValue, repayAmountCurrency,
        withdrawAmountValue, withdrawPool]
    );

    const handleAuthClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setAuthorizationModalOpen(false);
    }

    const handleBorrowClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setBorrowModalOpen(false);
    }

    const handleBorrowCurrencySelect = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: string;
    }>, child: React.ReactNode) => {
        setBorrowAmountCurrency(event.target.value);
    }

    const handleProvideClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setProvideModalOpen(false);
    }

    const handleRepayClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setRepayModalOpen(false);
    }

    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
    }

    const isBorrowError = (value: any, currency: string) => {
        if (value <= 0 ||
            value > data.borrowLimit - data.borrowLimitUsed) {
            return true;
        }
        return false;
    }

    const isProvideError = (value: any, pool: string) => {
        const index = collateralData.findIndex((value: any) => value.pool === pool);
        if (index < 0) return true;
        if (value <= 0 ||
            value > collateralData[index].available) {
            return true;
        }
        return false;
    }

    const isRepayError = (value: any, currency: string) => {
        const index = borrowData.findIndex((value: any) => value.currency === currency);
        if (index < 0) return true;
        if (value <= 0 ||
            value > borrowData[index].amount) {
            return true;
        }
        return false;
    }

    const isWithdrawError = (value: any, pool: string) => {
        const index = collateralData.findIndex((value: any) => value.pool === pool);
        if (index < 0) return true;
        if (value <= 0 ||
            value > collateralData[index].provided) {
            return true;
        }
        return false;
    }

    const onBorrowAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBorrowAmountValue(Number(event.target.value));
    };

    const onProvideAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // TO-DO: Web3 integration, calculate LP value
        setProvideLpValue(Number(event.target.value));
        setProvideAmountValue(Number(event.target.value));
    };

    const onRepayAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRepayAmountValue(Number(event.target.value));
    };

    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // TO-DO: Web3 integration, calculate LP value
        setWithdrawLpValue(Number(event.target.value));
        setWithdrawAmountValue(Number(event.target.value));
    };

    const onBorrowClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setBorrowModalOpen(true);
    }

    const onProvideClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setProvidePool(event.currentTarget.id);
        setProvideModalOpen(true);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setRepayAmountCurrency(event.currentTarget.id);
        setRepayModalOpen(true);
    }

    const onWithdrawClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setWithdrawPool(event.currentTarget.id);
        setWithdrawModalOpen(true);
    }

    const onAuth = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAuthorizationModalOpen(false);
        // TO-DO: Web3 integration
    }

    const onBorrow = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setBorrowModalOpen(false);
        // TO-DO: Web3 integration
    }

    const onProvide = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAuthAction("provide");
        setProvideModalOpen(false);
        // TO-DO: Web3 integration
        const provideAuthorization = false;
        if (provideAuthorization === false) {
            setAuthorizationModalOpen(true);
        }
    }

    const onRepay = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setAuthAction("repay");
        setRepayModalOpen(false);
        // TO-DO: Web3 integration
        const repayAuthorization = false;
        if (repayAuthorization === false) {
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
                <Header />
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Grid item>
                        <InformationCard header="Withdraw" text={`$${data.collateral.toFixed(2)}`} />
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
                        <BorrowerTable
                            data={collateralData}
                            onLeftButtonClick={onProvideClick}
                            onRightButtonClick={onWithdrawClick}
                            type="collateral" />
                    </Grid>
                    <Grid item>
                        <BorrowerTable
                            data={borrowData}
                            onLeftButtonClick={onBorrowClick}
                            onRightButtonClick={onRepayClick}
                            type="borrow" />
                    </Grid>
                </Grid>
            </Grid >
            <RowModal
                action={"Withdraw Collateral"}
                error={withdrawError}
                handleClose={handleWithdrawClose}
                lp={withdrawLpValue}
                onButtonClick={onWithdraw}
                onChange={onWithdrawAmountChange}
                open={withdrawModalOpen}
                pool={withdrawPool}
                poolIconSrcPrimary={poolIcons[withdrawPool]?.primarySrc || ""}
                poolIconSrcSecondary={poolIcons[withdrawPool]?.secondarySrc || ""}
            />
            <RowModal
                action={"Provide Collateral"}
                error={provideError}
                handleClose={handleProvideClose}
                lp={provideLpValue}
                onButtonClick={onProvide}
                onChange={onProvideAmountChange}
                open={provideModalOpen}
                pool={providePool}
                poolIconSrcPrimary={poolIcons[providePool]?.primarySrc || ""}
                poolIconSrcSecondary={poolIcons[providePool]?.secondarySrc || ""}
            />
            <BigModal
                action="Borrow"
                amount={borrowAmountValue}
                currency={borrowAmountCurrency}
                data={data}
                error={borrowError || borrowAmountValue === 0}
                handleClose={handleBorrowClose}
                handleSelect={handleBorrowCurrencySelect}
                onButtonClick={onBorrow}
                onChange={onBorrowAmountChange}
                open={borrowModalOpen} />
            <AmountModal
                action={"Repay " + repayAmountCurrency}
                amount={repayAmountValue}
                currency={repayAmountCurrency}
                error={repayError}
                iconSrc={currencyIcons[repayAmountCurrency] || ""}
                handleClose={handleRepayClose}
                onButtonClick={onRepay}
                onChange={onRepayAmountChange}
                open={repayModalOpen}
            />
            <AuthorizationModal
                action={authAction}
                handleClose={handleAuthClose}
                onButtonClick={onAuth}
                open={authorizationModalOpen}
            />
        </React.Fragment>
    );
}