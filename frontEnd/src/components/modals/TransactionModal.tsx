import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { CustomButton } from "../buttons/CustomButton";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    smallIcon: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

interface Props {
    action: string,
    handleClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
    txHash?: string,
}

export const TransactionModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open} >
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <DialogTitle >{props.action}</DialogTitle>
                    <Typography variant="subtitle1" color="textSecondary" >{props.action}</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <CustomButton 
                        text={props.action.charAt(0).toUpperCase() + props.action.slice(1)} 
                        type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}