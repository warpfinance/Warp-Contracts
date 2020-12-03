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
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
    buttonText?: string,
    contentText?: string,
    onButtonClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    titleText?: string,
}

export const SimpleModal: React.FC<Props> = (props: Props) => {
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
                    <CustomDialogTitle onClose={props.handleClose} >{props.titleText || ""}</CustomDialogTitle>
                    <Typography variant="subtitle1" color="textSecondary" >{props.contentText || ""}</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <CustomButton
                            onClick={props.onButtonClick || undefined}
                            text={props.buttonText || ""}
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}