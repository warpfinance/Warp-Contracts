import * as React from "react";

import { ConnectModal, CustomButton, Header } from "../../components";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
    centerButton: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }
}))

interface Props {
}

export const Connect: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [modalOpen, setModalOpen] = useState(false);

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setModalOpen(false);
    }

    const onClick= () => {
        setModalOpen(true);
    }

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={10}
            >
                <Header />
                <div className={classes.centerButton}>
                    <CustomButton onClick={onClick} text={"Connect wallet"} type={"long"} />
                </div>
            </Grid >
            <ConnectModal handleClose={handleClose} open={modalOpen} />
        </React.Fragment>
    )

}