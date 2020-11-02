import * as React from "react";

import { Avatar, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { Amount } from "../inputFields/Amount";
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
    error: boolean,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    lp: number,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    open: boolean,
    pool: string,
    poolIconSrcPrimary: string,
    poolIconSrcSecondary: string,
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
                            {props.pool}
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
                        <Amount adornment="USD" onChange={props.onChange} error={props.error} fullWidth={true} />
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
                                        {props.lp + " USD"}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CustomButton
                            disabled={props.lp <= 0 || props.error === true}
                            onClick={props.onButtonClick}
                            text={props.action.split(" ")[0]}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}