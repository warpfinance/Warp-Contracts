import * as React from "react";

import { Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core";

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    dialog: {
        borderRadius: "25px",
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.25)",
    },
    link: {
        textDecoration: "none",
    }
}));

interface Props {
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
    link: string,
    open: boolean,
    teamName: string,
}

interface State {
}

export const NftReferralModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const copyTextToClipboard = (text: string) => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
        }, function (err) {
            console.error(err);
        });
    }

    const fallbackCopyTextToClipboard = (text: string) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error(err);
        }

        document.body.removeChild(textArea);
    }

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
                    <DialogTitle >Your Team Referral Link</DialogTitle>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Typography variant="subtitle1" color="textSecondary" >
                            Team name
                        </Typography>
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.teamName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Typography variant="subtitle1" color="textSecondary" >
                            Link
                        </Typography>
                        <Card>
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography variant="subtitle1">
                                            {props.link}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={() => copyTextToClipboard(props.link)}>
                                            <FileCopyOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}
