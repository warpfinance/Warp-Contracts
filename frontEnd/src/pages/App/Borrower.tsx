import * as React from "react";

import { BigModal, BorrowerTable, Header, InformationCard, RowModal } from "../../components";

import { Grid } from "@material-ui/core";
import { useState } from "react";

interface Props {

}

const data = {
    collateral: 123.00,
    interestRate: 1.97,
}

export const Borrower: React.FC<Props> = (props: Props) => {
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);

    const handleBorrowClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setBorrowModalOpen(false);
    }

    const onBorrowClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setBorrowModalOpen(true);
    }

    const handleRepayClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setRepayModalOpen(false);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setRepayModalOpen(true);
    }

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
                        <BorrowerTable onButtonClick={onBorrowClick} type="borrow" />
                    </Grid>
                    <Grid item>
                        <BorrowerTable onButtonClick={onRepayClick} type="repay" />
                    </Grid>
                </Grid>
            </Grid >
            <BigModal action="Borrow" amount={100} currency="DAI" onButtonClick={onBorrow} handleClose={handleBorrowClose} open={borrowModalOpen} />
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