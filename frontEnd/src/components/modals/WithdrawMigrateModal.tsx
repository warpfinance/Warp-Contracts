import * as React from "react";

import { Amount, CustomButton, CustomDialogTitle, Text } from "../../components";
import { Avatar, Card, CardContent, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";

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
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onMaxButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    poolIconSrcPrimary: string,
    poolIconSrcSecondary: string,
    token: Token
    value: string
}

export const WithdrawMigrateModal: React.FC<Props> = (props: Props) => {
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
                    <CustomDialogTitle onClose={props.handleClose} >{props.action}</CustomDialogTitle>
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
                            <Grid item xs={9}>
                                <Amount fullWidth={true} adornment="USD" value={props.value} onChange={props.onChange} error={props.error} />
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
                        <CustomButton
                            disabled={props.error === true}
                            onClick={props.onButtonClick}
                            text={props.action.split(" ")[0]}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}