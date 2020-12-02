import * as React from "react";

import { CustomButton, NftModal, NftReferralModal } from "../../components"
import { Grid, IconButton, Link, Typography } from "@material-ui/core";
import { TransactionInfo, TransactionReceipt } from "../../util/types";

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Link as RouterLink } from 'react-router-dom';
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
    const [currentPage, setCurrentPage] = useState("");
    // TO-DO: Get current link from web3, if it exists
    const [link, setLink] = useState("");
    const [nftModalOpen, setNftModalOpen] = useState(false);
    const [nftReferralModalOpen, setNftReferralModalOpen] = useState(false);
    // TO-DO: Get team name from web3, if it exists
    const [teamName, setTeamName] = useState("");
    const [teamNameError, setTeamNameError] = useState(true);

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
                                {(link === "" || teamName === "") ?
                                    <CustomButton text={"Create team referral code"} onClick={() => setNftModalOpen(true)} type={"short"} />
                                    :
                                    <React.Fragment>
                                        <CustomButton disabled={true} text={teamName} type={"short"} />
                                        <IconButton onClick={() => copyTextToClipboard(link)}>
                                            <FileCopyOutlinedIcon />
                                        </IconButton>
                                    </React.Fragment>
                                }
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