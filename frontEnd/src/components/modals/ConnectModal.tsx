import * as React from "react";

import { Card, CardContent, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from "@material-ui/core";

import { CustomButton } from "..";
import { WalletType } from "../../util/types";
import connectors from "../../util/connectors";
import { makeStyles } from "@material-ui/core/styles";
import { useWeb3React } from "@web3-react/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    clickableCard:
    {
        cursor: "pointer"
    }
}));

interface Props {
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
}

interface State {
}

export const ConnectModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const context = useWeb3React();


    const connectToWallet = async (type: WalletType) => {
        if (type === WalletType.MetaMask) {
            await context.activate(connectors.MetaMask);
        }
        if (type === WalletType.WalletLink) {
            await context.activate(connectors.Coinbase);
        }
        if (type === WalletType.Portis) {
            await context.activate(connectors.Portis);
        }

    }

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"md"}
            onClose={props.handleClose}
            open={props.open} >
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <DialogTitle >Connect wallet</DialogTitle>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Card className={classes.clickableCard} onClick={() => connectToWallet(WalletType.WalletLink)}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Coinbase Wallet
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.clickableCard} onClick={() => connectToWallet(WalletType.Portis)}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Portis
                            </Typography>
                            </CardContent>
                        </Card>
                        <Card className={classes.clickableCard} onClick={() => connectToWallet(WalletType.MetaMask)}>
                            <CardContent>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Metamask
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <DialogContentText>
                        Familiar with Ethereum wallets?
                </DialogContentText>
                    <DialogContentText>
                        Learn more
                </DialogContentText>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}
