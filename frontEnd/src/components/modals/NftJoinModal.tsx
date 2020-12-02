import * as React from "react";

import { CustomButton, Text } from "../../components";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";

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
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onReferralCodeChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    open: boolean,
    referralCodeError?: boolean,
}

export const NftJoinModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open || false} >
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <DialogTitle >Join a Team</DialogTitle>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Text error={props.referralCodeError} fullWidth={true} onChange={props.onReferralCodeChange} text="Referral code" />
                        <CustomButton
                            disabled={props.referralCodeError}
                            onClick={props.onButtonClick}
                            text={"Join team"}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}