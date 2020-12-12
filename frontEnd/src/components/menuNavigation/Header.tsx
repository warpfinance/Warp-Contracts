import * as React from "react";

import { Card, CardContent, Grid, IconButton, Link, Typography } from "@material-ui/core";
import { CustomButton, ErrorCustomButton, NotificationModal, TeamJoinModal, TeamModal, TeamReferralModal } from "../../components"

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { TransactionInfo } from "../../util/types";
import { WarpControlService } from "../../services/warpControl";
import { copyTextToClipboard } from "../../util/tools"
import { getContractAddress } from "../../util/networks";
import { getLogger } from "../../util/logger";
import { isAddress } from "ethers/lib/utils";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom'
import { useNotificationModal } from "../../hooks/useNotificationModal";
import { useState } from "react";
import { useTeams } from "../../hooks/useTeams";
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

    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [teamJoinModalOpen, setTeamJoinModalOpen] = useState(false);
    const [teamReferralModalOpen, setTeamReferralModalOpen] = useState(false);

    const [teamNameError, setTeamNameError] = useState(true);
    const [linkError, setLinkError] = useState(true);

    const context = useWeb3React();
    const account = context.account;
    const walletAddress = account ? account : "Connect";
    const isConnected = Boolean(account);
    const { onTeam, teamCode, teamName, refresh } = useTeams();

    const [tryingToCreateTeam, setTryingToCreateTeam] = useState(false);
    const [tryingToJoinTeam, setTryingToJoinTeam] = useState(false);
    const [teamNameOverride, setTeamNameOverride] = useState("");
    const [teamCodeOverride, setTeamCodeOverride] = useState("");

    const elementSize = isConnected === true ? 1 : 3;

    const {
        notify,
        notifyError,
        modal
    } = useNotificationModal();

    React.useEffect(() => {
        if (teamNameOverride !== "" && teamNameOverride.length < 32) {
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
        setTeamJoinModalOpen(true);
    }

    const handleTeamCreateOpen = () => {
        setTeamModalOpen(true);
    }

    const handleTeamModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamNameOverride("")
        setTeamModalOpen(false);
    }

    const handleTeamJoinModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamCodeOverride("")
        setTeamJoinModalOpen(false);
    }

    const handleTeamReferralModalClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTeamNameOverride("")
        setTeamReferralModalOpen(false);
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

        setTeamModalOpen(false);
        setTeamReferralModalOpen(true);
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

        const exists = await control.teamExists(teamCodeOverride);

        if (!exists) {
            notifyError(`There is no team with the code ${teamCodeOverride} that exists.`, `Team not found`);
            return;
        }


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

            notifyError("Transaction failed. Please try again later.");
            return;
        }

        const joinedTeamName = await control.getTeamName(teamCodeOverride);
        setTeamNameOverride(joinedTeamName);

        setTeamJoinModalOpen(false);
        setTeamReferralModalOpen(true);
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
                            {(false/*!onTeam && !tryingToJoinTeam*/) ?
                                <React.Fragment>
                                    <Grid
                                        item
                                        xs
                                    >
                                        <CustomButton text={"Join a team"} type={"short"} onClick={handleTeamJoinOpen} />
                                    </Grid>
                                    <Grid
                                        item
                                        xs
                                    >
                                        <CustomButton text={"Create team"} onClick={handleTeamCreateOpen} type={"short"} />
                                    </Grid>
                                </React.Fragment>
                                :
                                <Grid
                                    item
                                    xs
                                >
                                    <Card className={classes.teamCard}>
                                        <CardContent>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-around"
                                                alignItems="baseline"
                                            >
                                                <Grid item>
                                                    <IconButton onClick={() => copyTextToClipboard(onTeam ? teamCode : teamCodeOverride)}>
                                                        <FileCopyOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1">
                                                        {"Team"/*onTeam ? teamName : teamNameOverride*/}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton href={"/team"}>
                                                        <ArrowForwardIosIcon fontSize="small" />
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
                        xs
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
                        xs
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
                        xs
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
                        xs
                    >
                        {connected === true ?
                            <Typography>
                                <RouterLink className={classes.routerLink} to={"/teams"}>
                                    <Link
                                        className={pathName === "/teams" ? classes.selectedLink : classes.link}
                                        color="textSecondary"
                                        href=""
                                        underline="none">
                                        NFTs
                                    </Link>
                                </RouterLink>
                            </Typography> :
                            <Typography className={classes.link} color="textSecondary">
                                NFTs
                            </Typography>
                        }
                    </Grid>
                    <Grid
                        item
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
            <TeamModal
                handleClose={handleTeamModalClose}
                onButtonClick={onTeamCreate}
                onTeamNameChange={onTeamNameChange}
                open={teamModalOpen}
                teamNameError={teamNameError}
            />
            <TeamJoinModal
                handleClose={handleTeamJoinModalClose}
                onButtonClick={onTeamJoin}
                onReferralCodeChange={onLinkChange}
                open={teamJoinModalOpen}
                referralCodeError={linkError}
            />
            <TeamReferralModal
                handleClose={handleTeamReferralModalClose}
                createTeamTx={createTeamTx}
                link={teamCodeOverride}
                open={teamReferralModalOpen}
                teamName={teamNameOverride}
                createdTeam={tryingToCreateTeam}
            />
            {modal}
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
                    xs
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