import * as React from "react";

import { Card, CardContent, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    }
});

interface Props extends WithStyles<typeof styles> {
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
}

interface State {
}

const DecoratedConnectModalClass = withStyles(styles)(
    class ConnectModalClass extends React.Component<Props, State> {
        render() {
            return (
                <Dialog
                    className={this.props.classes.dialog}
                    maxWidth={"md"}
                    onClose={this.props.handleClose}
                    open={this.props.open} >
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
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Coinbase Wallet
                                    </Typography>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Portis
                                    </Typography>
                                    </CardContent>
                                </Card>
                                <Card>
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
    }
)

const ConnectModal = connect(null, null)(DecoratedConnectModalClass)

export { ConnectModal };