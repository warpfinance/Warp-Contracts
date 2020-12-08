import * as React from "react";

import { Avatar, CircularProgress, Dialog, DialogActions, DialogContent, Grid, Typography } from "@material-ui/core";
import { CustomButton, CustomDialogTitle } from "../../components";
import { NetworkId, getEtherscanURL } from "../../util/networks";

import { AvatarGroup } from "@material-ui/lab";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { makeStyles } from "@material-ui/core";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";

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
    const { networkId } = useConnectedWeb3Context();

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

    const dialogActions = props.confirmed === true && props.txHash && getEtherscanURL(networkId as NetworkId) ?
        <CustomButton
            externalHref={true}
            href={getEtherscanURL(networkId as NetworkId) + props.txHash}
            text="View on Etherscan"
            type="short" /> :
        null;

    const dialogSubtitle = props.confirmed === true ?
        "Transaction Submitted" :
        "Submit the transaction in your wallet";

    const spinner = props.confirmed === true ?
        <CheckCircleOutlineIcon fontSize="large" color="secondary" /> :
        <CircularProgress color="secondary" />;

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open} >
            <CustomDialogTitle onClose={props.handleClose} disableTypography={true}>
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
            </CustomDialogTitle>
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
                    {
                        props.confirmed ? <Typography variant="subtitle1" color="textSecondary" >
                            Your transaction has been submitted. Please wait while it is confirmed.
                        </Typography> : null
                    }
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