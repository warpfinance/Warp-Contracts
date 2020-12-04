import * as React from "react";

import { Avatar, Card, CardContent, Checkbox, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import { CustomButton, CustomDialogTitle, ErrorCustomButton, Text } from "../../components";

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
    children?: any,
    contentText?: string,
    error?: boolean,
    onButtonClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    titleText?: string,
}

export const NotificationModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Dialog
            className={classes.dialog}
            maxWidth={"xs"}
            fullWidth={true}
            onClose={props.handleClose}
            open={props.open}>
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <CustomDialogTitle onClose={props.handleClose}>{props.titleText || "Error"}</CustomDialogTitle>
                    {props.children ||
                        <Typography variant="subtitle1" color="textSecondary" >{props.contentText || "Transaction failed"}</Typography>
                    }
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        {props.error === true ?
                            <ErrorCustomButton
                                onClick={props.onButtonClick || undefined}
                                text={props.buttonText || "Ok"}
                                type="short" />
                            :
                            <CustomButton
                                onClick={props.onButtonClick || undefined}
                                text={props.buttonText || "Ok"}
                                type="short" />
                        }
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}