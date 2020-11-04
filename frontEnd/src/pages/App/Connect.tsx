import * as React from "react";

import { ConnectModal, CustomButton, Header } from "../../components";

import { Grid } from "@material-ui/core";
import { WalletType } from "../../util/types";
import connectors from "../../util/connectors";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

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

    const [connected, setConnected] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const context = useWeb3React();
    const history = useHistory();

    const Connected = () => {
        setConnected(true);
        setModalOpen(false);
        history.push("/dashboard");
    }

    const connectToWallet = async (type: WalletType) => {
        if (type === WalletType.MetaMask) {
            await context.activate(connectors.MetaMask)
                .then((result) => {
                    Connected();
                }).catch((e) => {
                    console.error(e);
                });
        }
        if (type === WalletType.WalletLink) {
            await context.activate(connectors.Coinbase)
                .then((result) => {
                    Connected();
                }).catch((e) => {
                    console.error(e);
                });
        }
        if (type === WalletType.Portis) {
            await context.activate(connectors.Portis)
                .then((result) => {
                    Connected();
                }).catch((e) => {
                    console.error(e);
                });
        }
    }

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setModalOpen(false);
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
                spacing={10}
            >
                <Header connected={connected} />
                <div className={classes.centerButton}>
                    <CustomButton onClick={onClick} text={"Connect wallet"} type={"long"} />
                </div>
            </Grid >
            <ConnectModal connectToWallet={connectToWallet} handleClose={handleClose} open={modalOpen} />
        </React.Fragment>
    )

}