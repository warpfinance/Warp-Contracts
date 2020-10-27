import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
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
    amount: number,
    amountCurrency: string,
    amountIconSrc: string,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    reward: number,
    rewardCurrency: string,
    rewardIconSrcPrimary: string,
    rewardIconSrcSecondary: string,
}

export const RowModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [amountChecked, setAmountChecked] = React.useState(false);
    const [rewardChecked, setRewardChecked] = React.useState(false);

    const handleAmountCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setAmountChecked(event.target.checked);
    };

    const handleRewardCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setRewardChecked(event.target.checked);
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
                        <Typography variant="subtitle2" color="textSecondary" >
                            Repay
                        </Typography>
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
                                            checked={amountChecked}
                                            onChange={handleAmountCheck}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Avatar alt={props.amountIconSrc} className={classes.smallIcon} src={props.amountIconSrc} />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.amount + " " + props.amountCurrency}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Typography variant="subtitle2" color="textSecondary" >
                            Recevie
                        </Typography>
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
                                            checked={rewardChecked}
                                            onChange={handleRewardCheck}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <AvatarGroup max={2}>
                                            <Avatar alt={props.rewardIconSrcPrimary} className={classes.smallIcon} src={props.rewardIconSrcPrimary} />
                                            <Avatar alt={props.rewardIconSrcSecondary} className={classes.smallIcon} src={props.rewardIconSrcSecondary} />
                                        </AvatarGroup>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.reward + " " + props.rewardCurrency}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CustomButton
                            disabled={amountChecked !== true || rewardChecked !== true}
                            onClick={props.onButtonClick}
                            text={props.action.charAt(0).toUpperCase() + props.action.slice(1)}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}