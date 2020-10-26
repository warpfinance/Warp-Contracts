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
    const [modalOpen, setModalOpen] = useState(false);

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setModalOpen(false);
    }

    const onButtonClick = () => {

    }

    const onClick = () => {
        setModalOpen(true);
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
                        <LenderTable onButtonClick={onClick} type="lend" />
                    </Grid>
                    <Grid item>
                        <LenderTable onButtonClick={onClick} type="withdraw" />
                    </Grid>
                </Grid>
            </Grid >
            <SimpleModal amount={100} currency="DAI" iconSrc="dai.png" onButtonClick={onButtonClick} handleClose={handleClose} open={modalOpen} />
            <SimpleModal amount={100} currency="DAI" iconSrc="dai.png" onButtonClick={onButtonClick} handleClose={handleClose} open={modalOpen} />
        </React.Fragment>
    );
}
