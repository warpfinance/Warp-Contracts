import * as React from "react";

import { Card, CardContent, Dialog, DialogContent, Grid, IconButton, Typography } from "@material-ui/core";

import { CustomDialogTitle } from "../../components"
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { TransactionInfo } from "../../util/types";
import { copyTextToClipboard } from "../../util/tools"
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
    createTeamTx: Maybe<TransactionInfo>;
    createdTeam: boolean;
}

interface State {
}

export const TeamReferralModal: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const [waitingOnTx, setWaitingOnTx] = React.useState(true);

    React.useEffect(() => {
        let isSubscribed = true;
        if (!waitingOnTx) {
            return;
        }


        const waitForTx = async () => {
            if (!props.createTeamTx) {
                return;
            }

            await props.createTeamTx.finished;

            if (isSubscribed) {
                setWaitingOnTx(false);
            }
        }

        waitForTx();

        return () => {
            isSubscribed = false;
        }
    })

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
                    <CustomDialogTitle onClose={props.handleClose} >Your Team Referral Code</CustomDialogTitle>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        {
                            !waitingOnTx ? null :
                            (
                                props.createdTeam ? 
                                    <Typography variant="subtitle2" color="textPrimary" >
                                        Your team is being registered, once the transaction has been confirmed your referral code will be activated.
                                    </Typography>
                                :
                                    <Typography variant="subtitle2" color="textPrimary" >
                                        You are joining the team, it may take a few minutes for the transaction to complete.
                                    </Typography>
                            )
                        }
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
                            Referral Code
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
