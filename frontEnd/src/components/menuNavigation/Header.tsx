import * as React from "react";

import { Card, CardContent, Grid, IconButton, Link, Typography } from "@material-ui/core";
import { CustomButton, ErrorCustomButton, NftJoinModal, NftModal, NftReferralModal } from "../../components"

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { TransactionInfo } from "../../util/types";
import { WarpControlService } from "../../services/warpControl";
import { copyTextToClipboard } from "../../util/tools"
import { getContractAddress } from "../../util/networks";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom'
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

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
    },
    selectedLink: {
        color: "#FFFFFF",
    },
    teamCard: {
        maxHeight: "70px",
        maxWidth: "250px",
        paddingTop: "0px",
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

    const pathName = useLocation().pathname;
    const [createTeamTx, setCreateTeamTX] = useState<Maybe<TransactionInfo>>(null);
    // TO-DO: Get current link from web3, if it exists
    const [link, setLink] = useState("");
    const [nftModalOpen, setNftModalOpen] = useState(false);
    const [nftJoinModalOpen, setNftJoinModalOpen] = useState(false);
    const [nftReferralModalOpen, setNftReferralModalOpen] = useState(false);
    // TO-DO: Get team name from web3, if it exists
    const [teamName, setTeamName] = useState("");
    const [teamNameError, setTeamNameError] = useState(true);
    const [linkError, setLinkError] = useState(true);

    const context = useWeb3React();
    const account = context.account;
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
        // TO-DO: Validate referral code for web3
        if (link !== "") {
            setLinkError(false);
        }
        else {
            setLinkError(true);
        }
    }, [teamName, link]
    );

    const handleNftModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamName("")
        setNftModalOpen(false);
    }

    const handleNftJoinModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setLink("")
        setNftJoinModalOpen(false);
    }

    const handleNftReferralModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamName("")
        setNftReferralModalOpen(false);
    }

    const onTeamCreate = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.chainId || !context.account) {
            console.log("Not connected to web3");
            return;
        }

        const controlAddress = getContractAddress(context.chainId, 'warpControl');
        const control = new WarpControlService(context.library, context.account, controlAddress);
        const tx = await control.createTeam(teamName);
        setCreateTeamTX(tx);

        if (account) {
            setLink(account);
        }

        setNftModalOpen(false);
        setNftReferralModalOpen(true);
    }

    const onTeamJoin = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Web3 integration for joining a team
        setNftJoinModalOpen(false);
    }

    const onLinkChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setLink(event.currentTarget.value);
    }

    const onTeamNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTeamName(event.currentTarget.value);
    }

    const getHeaderContent = (connected: boolean) => {
        const connectButton =
            <ErrorCustomButton disabled={!connected}
                text={!connected ? "No wallet" : "Disconnect"}
                type="short"
                variant="contained"
            />

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
                                            sm
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
                            {(link === "" || teamName === "") ?
                                <React.Fragment>
                                    <Grid
                                        item
                                        sm
                                    >
                                        <CustomButton text={"Join a team"} type={"short"} onClick={() => setNftJoinModalOpen(true)} />
                                    </Grid>
                                    <Grid
                                        item
                                        sm
                                    >
                                        <CustomButton text={"Create team referral code"} onClick={() => setNftModalOpen(true)} type={"short"} />
                                    </Grid>
                                </React.Fragment>
                                :
                                <Grid
                                    item
                                    sm
                                >
                                    <Card className={classes.teamCard}>
                                        <CardContent>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="flex-start"
                                            >
                                                <Grid item>
                                                    <Typography variant="subtitle1">
                                                        {teamName}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton onClick={() => copyTextToClipboard(link)}>
                                                        <FileCopyOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            }
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
                                    <Link
                                        className={pathName === "/dashboard" ? classes.selectedLink : classes.link}
                                        color="textSecondary"
                                        href=""
                                        underline="none">
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
                                    <Link
                                        className={pathName === "/lender" ? classes.selectedLink : classes.link}
                                        color="textSecondary"
                                        href=""
                                        underline="none">
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
                                    <Link
                                        className={pathName === "/borrower" ? classes.selectedLink : classes.link}
                                        color="textSecondary"
                                        href=""
                                        underline="none">
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
                        sm
                    >
                        <Typography>
                            <RouterLink className={classes.routerLink} to={"/markets"}>
                                <Link
                                    className={pathName === "/markets" ? classes.selectedLink : classes.link}
                                    color="textSecondary"
                                    href=""
                                    underline="none">
                                    Markets
                                    </Link>
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={props.home ? 4 : undefined}
                    >
                        <Typography>
                            <Link className={classes.link} color="textSecondary" href={process.env.REACT_APP_DOCS_ENDPOINT || ""} underline="none">
                                Docs
                            </Link>
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
            <NftJoinModal
                handleClose={handleNftJoinModalClose}
                onButtonClick={onTeamJoin}
                onReferralCodeChange={onLinkChange}
                open={nftJoinModalOpen}
                referralCodeError={linkError}
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
                justify="space-between"
                alignItems="center"
                className={classes.content}
            >
                <Grid
                    item
                    sm
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