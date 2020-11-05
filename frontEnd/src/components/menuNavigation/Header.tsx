import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";

import { CustomButton } from "../../components"
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
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

    const { account } = useWeb3React();
    const walletAddress = account ? account : "Connect";
    const isConnected = Boolean(account);


    const getHeaderContent = (connected: boolean) => {
        const connectButton =
            <CustomButton disabled={true} text={!connected ? "No wallet" : truncate(walletAddress)} type={"short"} />

        if (!props.home) {
            return (
                <React.Fragment>
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
                        <Typography>
                            <Typography className={classes.link} color="textSecondary">
                                Docs
                            </Typography>
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
                sm={(!props.home) ? 8 : 1}
            >
                <RouterLink to={"/"}>
                    <img className={classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                </RouterLink>
            </Grid>
            {getHeaderContent(isConnected || false)}
        </Grid>
    );
}