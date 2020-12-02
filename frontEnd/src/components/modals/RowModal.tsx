import * as React from "react";

import { Amount, CustomButton, Text } from "../../components";
import { Avatar, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import { Token } from "../../util/token";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    maxButton: {
        "&:hover": {
            cursor: "pointer",
            color: "#FFFFFF",
        }
    },
    smallIcon: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

interface Props {
    action: string,
    error: boolean,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    lp: number,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onMaxButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    poolIconSrcPrimary: string,
    poolIconSrcSecondary: string,
    token: Token,
    onReferralCodeChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    referralCodeError?: boolean,
}

export const RowModal: React.FC<Props> = (props: Props) => {
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
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <AvatarGroup max={2}>
                            <Avatar alt={props.poolIconSrcPrimary} className={classes.smallIcon} src={props.poolIconSrcPrimary} />
                            <Avatar alt={props.poolIconSrcSecondary} className={classes.smallIcon} src={props.poolIconSrcSecondary} />
                        </AvatarGroup>
                        <Typography>
                            {props.token.symbol}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Typography variant="subtitle2" color="textSecondary" >
                            {props.action.split(" ")[0]}
                        </Typography>
                        <Grid
                            container
                            item
                            direction="row"
                            justify="space-around"
                            alignItems="center"
                        >
                            <Grid item xs={2}></Grid>
                            <Grid item xs={6}>
                                <Amount adornment="USD" onChange={props.onChange} error={props.error} />
                            </Grid>
                            <Grid item>
                                <Typography
                                    className={classes.maxButton}
                                    onClick={props.onMaxButtonClick}
                                    color="textSecondary"
                                    variant="subtitle1"
                                >
                                    max
                            </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle2" color="textSecondary" >
                            Amount of LP
                        </Typography>
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Typography variant="subtitle1">
                                        {props.lp.toLocaleString(undefined, { maximumFractionDigits: 6 }) + " LP"}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                        {props.action.toLowerCase() === "provide collateral" ?
                            <Text error={props.referralCodeError} fullWidth={true} onChange={props.onReferralCodeChange} text="Referral code" />
                            :
                            null
                        }
                        <CustomButton
                            disabled={props.lp <= 0 || props.error === true || props.referralCodeError === true}
                            onClick={props.onButtonClick}
                            text={props.action.split(" ")[0]}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}