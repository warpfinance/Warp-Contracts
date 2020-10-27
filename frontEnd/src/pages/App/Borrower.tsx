import * as React from "react";

import { BigModal, BorrowerTable, Header, InformationCard } from "../../components";

import { Grid } from "@material-ui/core";
import { useState } from "react";

interface Props {

}

const data = {
    collateral: 123.00,
    interestRate: 1.97,
}

export const Borrower: React.FC<Props> = (props: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setModalOpen(false);
    }

    const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setModalOpen(true);
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
                        <BorrowerTable onButtonClick={onClick} type="borrow" />
                    </Grid>
                    <Grid item>
                        <BorrowerTable onButtonClick={onClick} type="repay" />
                    </Grid>
                </Grid>
            </Grid >
            <BigModal action="Borrow" amount={100} currency="DAI" onButtonClick={onBorrow} handleClose={handleClose} open={modalOpen} />
        </React.Fragment>
    );
}