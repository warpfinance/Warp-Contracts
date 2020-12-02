import * as React from "react";

import { Amount, CustomButton, Text } from "../../components";
import { Avatar, Card, CardContent, Dialog, DialogContent, DialogTitle, FormControl, Grid, MenuItem, Select, Typography } from "@material-ui/core";

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
    icon: {
        fill: theme.palette.secondary.main,
    },
    select: {
        '&:before': {
            borderColor: theme.palette.secondary.main,
        },
        '&:after': {
            borderColor: theme.palette.secondary.main,
        }
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
    data: any,
    error: boolean,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    handleSelect: (event: React.ChangeEvent<{
        name?: string | undefined;
        value: string;
    }>, child: React.ReactNode) => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    open: boolean,
}

export const BigModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [enteredValue, setEnteredValue] = React.useState("");

    const onChangeWrapper = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEnteredValue(event.target.value);
        props.onChange(event);
      }

    React.useEffect(() => {
        setEnteredValue("");
    }, [props.open]);

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"sm"}
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
                    <Typography variant="subtitle1" color="textSecondary" >Enter amount and select stable coin</Typography>
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
                            spacing={1}
                        >
                            <Grid item>
                                <Amount
                                    adornment=""
                                    onChange={onChangeWrapper}
                                    value={enteredValue}
                                    error={props.error} />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Stable coin
                                </Typography>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <FormControl className={classes.cardTile} variant="outlined">
                                        <Select
                                            value={props.currency}
                                            // @ts-ignore
                                            onChange={props.handleSelect}
                                            label="Stable coin"
                                            className={classes.select}
                                            inputProps={{
                                                classes: {
                                                    icon: classes.icon,
                                                },
                                            }}
                                        >
                                            <MenuItem value={"DAI"}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Avatar alt={"dai.png"} className={classes.smallIcon} src={"dai.png"} />
                                                    </Grid>
                                                    <Grid item>
                                                        DAI
                                                    </Grid>
                                                </Grid>
                                            </MenuItem>
                                            <MenuItem value={"USDT"}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Avatar alt={"usdt.png"} className={classes.smallIcon} src={"usdt.png"} />
                                                    </Grid>
                                                    <Grid item>
                                                        USDT
                                                    </Grid>
                                                </Grid>
                                            </MenuItem>
                                            <MenuItem value={"USDC"}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Avatar alt={"usdc.png"} className={classes.smallIcon} src={"usdc.png"} />
                                                    </Grid>
                                                    <Grid item>
                                                        USDC
                                                    </Grid>
                                                </Grid>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
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
                                                ${props.data.borrowLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                                                {props.data.interestRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}%
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
                                                {
                                                    "$" + 
                                                    props.data.borrowLimitUsed.toLocaleString(undefined, { minimumFractionDigits: 2 }) +
                                                    " -> $" + 
                                                    props.data.newBorrowLimitUsed.toLocaleString(undefined, { minimumFractionDigits: 2})
                                                }
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <CustomButton
                            disabled={props.error}
                            onClick={props.onButtonClick}
                            text={props.action.charAt(0).toUpperCase() + props.action.slice(1)}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}