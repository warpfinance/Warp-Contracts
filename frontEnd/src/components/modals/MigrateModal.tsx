import * as React from "react";

import { Amount, CustomButton, CustomDialogTitle, Text } from "../../components";
import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";

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
    currency: string,
    error: boolean,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    iconSrc: string,
    migrateDepositDisabled: boolean,
    migrateWithdrawDisabled: boolean,
    migrateApproveDisabled: boolean,
    onDepositClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    onWithdrawClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    value: string
    onApproveClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const MigrateModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setChecked(event.target.checked);
    };

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"sm"}
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
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-around"
                                    alignItems="center"
                                >
                                    <Grid item xs={3}>
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleCheck}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Avatar alt={props.iconSrc} className={classes.smallIcon} src={props.iconSrc} />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="subtitle1">
                                            {props.value + " " + props.currency}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Grid
                            container
                            item
                            direction="row"
                            justify="space-around"
                            alignItems="center"
                        >
                            <CustomButton
                                disabled={props.error === true || props.migrateWithdrawDisabled === true || checked !== true}
                                onClick={props.onWithdrawClick}
                                text={"Withdraw"}
                                type="short" />
                            <CustomButton
                                disabled={props.error === true || props.migrateApproveDisabled === true || checked !== true}
                                onClick={props.onApproveClick}
                                text={"Approve"}
                                type="short" />
                            <CustomButton
                                disabled={props.error === true || props.migrateDepositDisabled === true || checked !== true}
                                onClick={props.onDepositClick}
                                text={"Deposit"}
                                type="short" />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}