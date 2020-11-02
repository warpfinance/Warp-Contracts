import * as React from "react";

import { Amount, CustomButton } from "../../components";
import { Avatar, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

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
    amount: number,
    currency: string,
    error: boolean,
    iconSrc: string,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    open: boolean,
}

export const AmountModal: React.FC<Props> = (props: Props) => {
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
                    <Typography variant="subtitle1" color="textSecondary" >Insert amount</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item>
                                <Avatar alt={props.iconSrc} src={props.iconSrc} />
                            </Grid>
                            <Grid item>
                                <Amount adornment={props.currency} onChange={props.onChange} error={props.error} fullWidth={true} />
                            </Grid>
                        </Grid>
                        <CustomButton
                            disabled={props.amount <= 0 || props.error === true}
                            onClick={props.onButtonClick}
                            text={props.action.split(" ")[0]}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}