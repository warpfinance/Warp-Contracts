import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import { CustomButton, Text } from "../../components";

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
    amount: number | string,
    currency: string,
    iconSrc: string,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    onReferralCodeChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    referralCodeError?: boolean,
}

export const SimpleModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setChecked(event.target.checked);
    };

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
                    <Typography variant="subtitle1" color="textSecondary" >Please confirm {props.action.charAt(0).toLowerCase() + props.action.slice(1)}</Typography>
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
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item xs={4}>
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleCheck}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Avatar alt={props.iconSrc} className={classes.smallIcon} src={props.iconSrc} />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.amount + " " + props.currency}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}></Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        {props.action.toLowerCase() === "lend" ?
                            <Text error={props.referralCodeError} fullWidth={true} onChange={props.onReferralCodeChange} text="Referral code" />
                            :
                            null
                        }
                        <CustomButton
                            disabled={checked !== true || props.referralCodeError === true}
                            onClick={props.onButtonClick}
                            text={props.action.charAt(0).toUpperCase() + props.action.slice(1)}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}