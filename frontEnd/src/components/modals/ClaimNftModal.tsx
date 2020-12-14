import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import { CustomButton, CustomDialogTitle, Text } from "../../components";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
}));

interface Props {
    amount: number | string,
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
    type: "social" | "legendary" | "epic" | "rare",
    disabled?: boolean,
}

export const ClaimNftModal: React.FC<Props> = (props: Props) => {
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
                    <CustomDialogTitle onClose={props.handleClose} >Claim NFTs</CustomDialogTitle>
                    <Typography variant="subtitle1" color="textSecondary" >{props.type.charAt(0).toUpperCase() + props.type.slice(1) + " NFTs"}</Typography>
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
                                    <Grid item xs={4}>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1">
                                            {props.amount}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            NFTs
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CustomButton
                            disabled={props.disabled ? props.disabled : false}
                            onClick={props.onButtonClick}
                            text={"Claim " + props.type.charAt(0).toUpperCase() + props.type.slice(1) + " NFTs"}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}