import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { CustomButton } from "../buttons/CustomButton";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    dialogContent: {
        paddingBottom: "50px",
    },
    smallIcon: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

interface Props {
    action: string,
    confirmed?: boolean,
    handleClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
    txHash?: string,
}

export const TransactionModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const dialogContent = props.confirmed === true ?
        null :
        <React.Fragment>
            <DialogTitle >{props.action}</DialogTitle>
            <CircularProgress color="secondary" />
            <Typography variant="subtitle1" color="textSecondary" >
                Confirm the transaction in your wallet
            </Typography>
        </React.Fragment>

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open} >
            <DialogContent className={classes.dialogContent}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    {dialogContent}
                </Grid>
            </DialogContent>
        </Dialog >
    );
}