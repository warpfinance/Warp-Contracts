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
    nfts: string[],
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    open: boolean,
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
                    <Typography variant="subtitle1" color="textSecondary" >You are claiming your NFTs</Typography>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        {props.nfts.map((nft, i) => {
                            return (
                                <Card>
                                    <CardContent>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6">
                                                {`${nft.charAt(0).toUpperCase() + nft.slice(1)} NFT`}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        <CustomButton
                            disabled={props.disabled ? props.disabled : false}
                            onClick={props.onButtonClick}
                            text="Claim NFTs"
                            type="short" />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    );
}