import * as React from "react";

import { CustomButton, NftModal, NftReferralModal } from "../../components"
import { Grid, Link, Typography } from "@material-ui/core";

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { TransactionInfo, TransactionReceipt } from "../../util/types";

const useStyles = makeStyles(theme => ({
    content: {
        zIndex: 1,
    },
    logo: {
        maxHeight: '36px'
    },
    link: {
        "&:hover": {
            color: "#FFFFFF",
        }
    },
    routerLink: {
        textDecoration: 'none',
    }
}));


interface Props {
    home?: boolean
}

export const Header: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const truncate = (input: string) => {
        if (input.length > 5) {
            return input.substring(0, 5) + '...';
        }
        return input;
    };

    const [createTeamTx, setCreateTeamTX] = useState<Maybe<TransactionInfo>>(null);
    const [link, setLink] = useState("");
    const [nftModalOpen, setNftModalOpen] = useState(false);
    const [nftReferralModalOpen, setNftReferralModalOpen] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamNameError, setTeamNameError] = useState(true);

    const { account } = useWeb3React();
    const walletAddress = account ? account : "Connect";
    const isConnected = Boolean(account);

    React.useEffect(() => {
        // TO-DO: Validate team name for web3
        if (teamName !== "") {
            setTeamNameError(false);
        }
        else {
            setTeamNameError(true);
        }
    }, [teamName]
    );

    const handleNftModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamName("")
        setNftModalOpen(false);
    }

    const handleNftReferralModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamName("")
        setNftReferralModalOpen(false);
    }

    const onTeamCreate = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // do TX
        const p: Promise<TransactionInfo> = new Promise((resolve) => {
            resolve({
                finished: new Promise((resolve) => {
                    console.log("hey")
                }),
                hash: "0x"
            })
        });
        setCreateTeamTX(await p);

        if (account) {
            setLink(account);
        }

        setNftModalOpen(false);
        setNftReferralModalOpen(true);
    }

    const onTeamNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTeamName(event.currentTarget.value);
    }


    const getHeaderContent = (connected: boolean) => {
        const connectButton =
            <CustomButton disabled={true} text={!connected ? "No wallet" : truncate(walletAddress)} type={"short"} />

        if (!props.home) {
            return (
                <React.Fragment>
                    {connected === true ?
                        <React.Fragment>
                            <BorrowerCountdownContext.Consumer>
                                {value =>
                                    value.countdown === true ?
                                        <Grid
                                            item
                                        >
                                            <Typography color="textSecondary">
                                                Warp borrowing starts in
                                    </Typography>
                                            <Typography>
                                                {value.countdownText}
                                            </Typography>
                                        </Grid>
                                        :
                                        null
                                }
                            </BorrowerCountdownContext.Consumer>
                            <Grid
                                item
                            >
                                <CustomButton text={"Create team referral code"} onClick={() => setNftModalOpen(true)} type={"short"} />
                            </Grid>
                        </React.Fragment>
                        :
                        null
                    }
                    <Grid
                        item
                        sm
                    >
                        {connected === true ?
                            <Typography>
                                <RouterLink className={classes.routerLink} to={"/dashboard"}>
                                    <Link className={classes.link} color="textSecondary" href="" underline="none">
                                        Dashboard
                                    </Link>
                                </RouterLink>
                            </Typography> :
                            <Typography className={classes.link} color="textSecondary">
                                Dashboard
                            </Typography>
                        }
                    </Grid>
                    <Grid
                        item
                        sm
                    >
                        {connected === true ?
                            <Typography>
                                <RouterLink className={classes.routerLink} to={"/lender"}>
                                    <Link className={classes.link} color="textSecondary" href="" underline="none">
                                        Lender
                                    </Link>
                                </RouterLink>
                            </Typography> :
                            <Typography className={classes.link} color="textSecondary">
                                Lender
                            </Typography>
                        }
                    </Grid>
                    <Grid
                        item
                        sm
                    >
                        {connected === true ?
                            <Typography>
                                <RouterLink className={classes.routerLink} to={"/borrower"}>
                                    <Link className={classes.link} color="textSecondary" href="" underline="none">
                                        Borrower
                                    </Link>
                                </RouterLink>
                            </Typography> :
                            <Typography className={classes.link} color="textSecondary">
                                Borrower
                            </Typography>
                        }
                    </Grid>
                    <Grid
                        item
                        sm
                    >
                        {connectButton}
                    </Grid>
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    <Grid
                        item
                    >
                        <Typography>
                            <RouterLink className={classes.routerLink} to={"/markets"}>
                                <Link className={classes.link} color="textSecondary" href="" underline="none">
                                    Markets
                                    </Link>
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                    >
                        <Typography className={classes.link} color="textSecondary">
                            Docs
                            </Typography>
                    </Grid>
                    <Grid
                        item
                    >
                        <CustomButton href={"/connect"} text={"App"} type={"short"} />
                    </Grid>
                </React.Fragment>
            );
        }
    }


    return (
        <React.Fragment>
            <NftModal
                handleClose={handleNftModalClose}
                onButtonClick={onTeamCreate}
                onTeamNameChange={onTeamNameChange}
                open={nftModalOpen}
                teamNameError={teamNameError}
            />
            <NftReferralModal
                handleClose={handleNftReferralModalClose}
                createTeamTx={createTeamTx}
                link={link}
                open={nftReferralModalOpen}
                teamName={teamName}
            />
            <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={(!props.home) ? 3 : 1}
                className={classes.content}
            >
                <Grid
                    item
                    sm={(!props.home) ? 5 : 1}
                >
                    <RouterLink to={"/"}>
                        <img className={classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                    </RouterLink>
                </Grid>
                {getHeaderContent(isConnected || false)}
            </Grid>
        </React.Fragment>
    );
}