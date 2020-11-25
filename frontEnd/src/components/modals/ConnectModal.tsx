import * as React from "react";

import { Avatar, Card, CardContent, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from "@material-ui/core";

import { WalletType } from "../../util/types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    clickableCard:
    {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#808080"
        }
    },
    link: {
        textDecoration: "none",
    }
}));

interface Props {
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    connectToWallet: (type: WalletType) => void,
    open: boolean,
}

interface State {
}

export const ConnectModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();


    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"sm"}
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
                        <Card className={classes.clickableCard} onClick={() => props.connectToWallet(WalletType.WalletLink)}>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Avatar alt="walletconnect-wallet.svg" src="walletconnect-wallet.svg" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            WalletConnect
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card className={classes.clickableCard} onClick={() => props.connectToWallet(WalletType.Portis)}>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Avatar alt="portis-wallet.svg" src="portis-wallet.svg" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            Portis
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card className={classes.clickableCard} onClick={() => props.connectToWallet(WalletType.MetaMask)}>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Avatar alt="metamask-wallet.svg" src="metamask-wallet.svg" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            Metamask
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <DialogContentText>
                        Familiar with Ethereum wallets?
                    </DialogContentText>
                    <Link className={classes.link} href={"https://ethereum.org/en/wallets/"}>
                        <DialogContentText color="secondary">
                            Learn more
                        </DialogContentText>
                    </Link>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}
