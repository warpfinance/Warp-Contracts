import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { CustomButton } from "../buttons/CustomButton";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    cardTile:
    {
        height: "60px",
        minWidth: "176px",
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
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
}

const data = {
    amount: 100,
    borrowLimit: 200,
    borrowLimitUsed: 200,
    interestRate: 1.97,
    yieldFarmingApy: 12,
}

export const BigModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setChecked(event.target.checked);
    };

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"md"}
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
                    <Typography variant="subtitle1" color="textSecondary" >Please confirm amount and select stable coin</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid
                            container
                            direction="row"
                        >
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Amount
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-start"
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onChange={handleCheck}
                                            />
                                            <Typography variant="h6">
                                                {data.amount}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Stable coin
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                DAI
                                        </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Yield farming APY
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                {data.interestRate.toLocaleString()}%
                                        </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="stretch"
                        >
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Borrow limit
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                ${data.borrowLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Interest rate
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                {data.interestRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}%
                                        </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Borrow Limit Used
                                </Typography>
                                <Card className={classes.cardTile}>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                ${data.borrowLimitUsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <CustomButton
                            disabled={checked !== true}
                            onClick={props.onButtonClick}
                            text={props.action.charAt(0).toUpperCase() + props.action.slice(1)}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}