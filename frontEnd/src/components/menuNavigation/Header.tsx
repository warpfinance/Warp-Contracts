import * as React from "react";

import { Card, CardContent, Grid, IconButton, Link, Typography } from "@material-ui/core";
import { CustomButton, ErrorCustomButton, NftJoinModal, NftModal, NftReferralModal, NotificationModal } from "../../components"

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
import { useTeams } from "../../hooks/useTeams";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { isAddress } from "ethers/lib/utils";
import { getLogger } from "../../util/logger";

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

const logger = getLogger('Components::Header');

export const Header: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const truncate = (input: string) => {
        if (input.length > 10) {
            return input.substring(0, 6) + '...' + input.slice(-4);
        }
        return input;
    };

    const pathName = useLocation().pathname;
    const [createTeamTx, setCreateTeamTX] = useState<Maybe<TransactionInfo>>(null);
    const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);

    const [nftModalOpen, setNftModalOpen] = useState(false);
    const [nftJoinModalOpen, setNftJoinModalOpen] = useState(false);
    const [nftReferralModalOpen, setNftReferralModalOpen] = useState(false);

    const [teamNameError, setTeamNameError] = useState(true);
    const [linkError, setLinkError] = useState(true);

    const context = useWeb3React();
    const account = context.account;
    const walletAddress = account ? account : "Connect";
    const isConnected = Boolean(account);
    const { onTeam, teamCode, teamName, refresh} = useTeams();

    const [tryingToCreateTeam, setTryingToCreateTeam] = useState(false);
    const [tryingToJoinTeam, setTryingToJoinTeam] = useState(false);
    const [teamNameOverride, setTeamNameOverride] = useState("");
    const [teamCodeOverride, setTeamCodeOverride] = useState("");

    React.useEffect(() => {
        if (teamNameOverride !== "") {
            setTeamNameError(false);
        }
        else {
            setTeamNameError(true);
        }

        if (teamCodeOverride !== "") {
            setLinkError(!isAddress(teamCodeOverride));
        }
        else {
            setLinkError(true);
        }
    }, [teamNameOverride, teamCodeOverride]
    );


    const handleDisconnectModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setDisconnectModalOpen(false);
    }

    const handleTeamJoinOpen = () => {
        setNftJoinModalOpen(true);
    }

    const handleTeamCreateOpen = () => {
        setNftModalOpen(true);
    }

    const handleNftModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamNameOverride("")
        setNftModalOpen(false);
    }

    const handleNftJoinModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamCodeOverride("")
        setNftJoinModalOpen(false);
    }

    const handleNftReferralModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamNameOverride("")
        setNftReferralModalOpen(false);
    }

    const onTeamCreate = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.chainId || !context.account) {
            console.log("Not connected to web3");
            return;
        }

        const controlAddress = getContractAddress(context.chainId, 'warpControl');
        const control = new WarpControlService(context.library, context.account, controlAddress);
        let tx: Maybe<TransactionInfo> = null;
        try {
            tx = await control.createTeam(teamNameOverride);
            setCreateTeamTX(tx);
        } catch (e) {
            let reason = `${e.message}`;
            if (e.data) {
                reason += `\n${e.data.message}`;
            }
            logger.error(`\nTransaction Failed!  Reason:\n${reason}`);
            throw e;
        }
        

        if (account) {
            setTeamCodeOverride(account);
        }

        setNftModalOpen(false);
        setNftReferralModalOpen(true);
        setTryingToJoinTeam(true);
        setTryingToCreateTeam(true);

        await tx.finished;
        refresh();
    }

    const onTeamJoin = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.chainId || !context.account) {
            console.log("Not connected to web3");
            return;
        }

        const controlAddress = getContractAddress(context.chainId, 'warpControl');
        const control = new WarpControlService(context.library, context.account, controlAddress);
        let tx: Maybe<TransactionInfo> = null;
        try {
            tx = await control.joinTeam(teamCodeOverride);
            setCreateTeamTX(tx);
        } catch (e) {
            let reason = `${e.message}`;
            if (e.data) {
                reason += `\n${e.data.message}`;
            }
            logger.error(`\nTransaction Failed!  Reason:\n${reason}`);
            throw e;
        }

        const joinedTeamName = await control.getTeamName(teamCodeOverride);
        setTeamNameOverride(joinedTeamName);

        setNftJoinModalOpen(false);
        setNftReferralModalOpen(true);
        setTryingToCreateTeam(false);
        setTryingToJoinTeam(true);

        await tx.finished;
        refresh();
    }

    const onLinkChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTeamCodeOverride(event.currentTarget.value);
    }

    const onTeamNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTeamNameOverride(event.currentTarget.value);
    }

    const onDisconnect = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setDisconnectModalOpen(false);
        context.deactivate();
    }

    const getHeaderContent = (connected: boolean) => {
        const connectButton =
            <ErrorCustomButton
                disabled={!connected}
                onClick={!connected ? undefined : () => setDisconnectModalOpen(true)}
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
                            {(!onTeam && !tryingToJoinTeam) ?
                                <React.Fragment>
                                    <Grid
                                        item
                                        sm
                                    >
                                        <CustomButton text={"Join a team"} type={"short"} onClick={handleTeamJoinOpen} />
                                    </Grid>
                                    <Grid
                                        item
                                        sm
                                    >
                                        <CustomButton text={"Create team referral code"} onClick={handleTeamCreateOpen} type={"short"} />
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
                                                        {onTeam ? teamName : teamNameOverride}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton onClick={() => copyTextToClipboard(onTeam ? teamCode : teamCodeOverride)}>
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
            <NotificationModal
                children={
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">{truncate(walletAddress)}</Typography>
                        </CardContent>
                    </Card>
                }
                handleClose={handleDisconnectModalClose}
                onButtonClick={onDisconnect}
                open={disconnectModalOpen}
                buttonText={"Log out"}
                titleText={"Account"}
            />
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
                link={teamCodeOverride}
                open={nftReferralModalOpen}
                teamName={teamNameOverride}
                createdTeam={tryingToCreateTeam}
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