import * as React from "react";

import { Avatar, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { CustomButton } from "../buttons/CustomButton";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    clickableCard:
    {
        cursor: "pointer"
    },
}));

interface Props {
    amount: number,
    currency: string,
    iconSrc: string,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
}

export const SimpleModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

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
                    <DialogTitle >Lend</DialogTitle>
                    <Typography variant="subtitle1" color="textSecondary" >Please confirm lend</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Card className={classes.clickableCard}>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Avatar alt={props.iconSrc} src={props.iconSrc} />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.amount}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.currency}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CustomButton onClick={props.onButtonClick} text={"Lend"} type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}