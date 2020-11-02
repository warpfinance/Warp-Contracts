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
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    pool: string,
    rewardIconSrcPrimary: string,
    rewardIconSrcSecondary: string,
}

export const RowModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [amount, setAmount] = React.useState(false);

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
                    <AvatarGroup max={2}>
                        <Avatar alt={props.rewardIconSrcPrimary} className={classes.smallIcon} src={props.rewardIconSrcPrimary} />
                        <Avatar alt={props.rewardIconSrcSecondary} className={classes.smallIcon} src={props.rewardIconSrcSecondary} />
                    </AvatarGroup>
                    <Typography>
                        {props.pool}
                    </Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Typography variant="subtitle2" color="textSecondary" >
                            {props.action.split(" ")[0]}
                        </Typography>
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {"100 USD"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Typography variant="subtitle2" color="textSecondary" >
                            Amount of LP
                        </Typography>
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item>

                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {"100 LP"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CustomButton
                            onClick={props.onButtonClick}
                            text={props.action.split(" ")[0]}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}