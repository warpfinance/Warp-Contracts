import * as React from "react";

import { Avatar, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
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
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
    confirmed?: boolean,
    poolIconSrcPrimary?: string,
    poolIconSrcSecondary?: string,
    pool?: string,
    txHash?: string,
}

export const TransactionModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const title = (props.action === "provide" || props.action === "withdraw") ?
        props.action.charAt(0).toUpperCase() + props.action.slice(1) + " Collateral" :
        props.action.charAt(0).toUpperCase() + props.action.slice(1);

    const icons = props.poolIconSrcPrimary && props.poolIconSrcSecondary && props.pool ?
        <React.Fragment>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <AvatarGroup max={2}>
                    <Avatar className={classes.smallIcon} alt={props.poolIconSrcPrimary} src={props.poolIconSrcPrimary} />;
                    <Avatar className={classes.smallIcon} alt={props.poolIconSrcSecondary} src={props.poolIconSrcSecondary} />;
                </AvatarGroup>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.pool}
                </Typography>
            </Grid>
        </React.Fragment>
        :
        null;

    const dialogActions = props.confirmed === true && props.txHash && process.env.REACT_APP_ETHERSCAN_TRANSACTION_ENDPOINT ?
        <CustomButton
            externalHref={true}
            href={process.env.REACT_APP_ETHERSCAN_TRANSACTION_ENDPOINT + props.txHash}
            text="View on Etherscan"
            type="short" /> :
        null;

    const dialogSubtitle = props.confirmed === true ?
        "Confirmed" :
        "Confirm the transaction in your wallet";

    const spinner = props.confirmed === true ?
        <CheckCircleOutlineIcon fontSize="large" color="secondary"/> :
        <CircularProgress color="secondary" />;

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open} >
            <DialogTitle disableTypography={true}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Typography variant="h5">
                        {title}
                    </Typography>
                    {icons}
                </Grid>
            </DialogTitle>
            <DialogContent >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    {spinner}
                    <Typography variant="subtitle1" color="textSecondary" >
                        {dialogSubtitle}
                    </Typography>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    {dialogActions}
                </Grid>
            </DialogActions>
        </Dialog >
    );
}