import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";

import { CustomButton } from "../../components"
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";

// TO-DO: Web3 integration
const data = {
    walletAddress: '0xeB31973E0FeBF3e3D7058234a5eBbAe1aB4B8c23',
    walletBalance: 0.0,
}

const useStyles = makeStyles(theme => ({
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
    connected?: boolean
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


    const getHeaderContent = (connected: boolean) => {
        const connectButton =
            <CustomButton disabled={true} text={!connected ? "No wallet" : truncate(data.walletAddress)} type={"short"} />

        if (!props.home) {
            return (
                <React.Fragment>
                    <Grid
                        item
                        md
                    >
                        <Typography>
                            <RouterLink className={classes.routerLink} to={"/dashboard"}>
                                <Link className={classes.link} color="textSecondary" href="" underline="none">
                                    Dashboard
                                    </Link>
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md
                    >
                        <Typography>
                            <RouterLink className={classes.routerLink} to={"/lender"}>
                                <Link className={classes.link} color="textSecondary" href="" underline="none">
                                    Lender
                                    </Link>
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md
                    >
                        <Typography>
                            <RouterLink className={classes.routerLink} to={"/borrower"}>
                                <Link className={classes.link} color="textSecondary" href="" underline="none">
                                    Borrower
                                    </Link>
                            </RouterLink>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md
                    >
                        <Typography>
                            <Typography className={classes.link} color="textSecondary">
                                Vote
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md
                    >
                        <CustomButton
                            disabled={false}
                            iconSrc="warpToken.svg"
                            text={data.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                            type={"short"}
                            wallet={true} />
                    </Grid>
                    <Grid
                        item
                        md
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
        >
            <Grid
                item
                md={(!props.home) ? 5 : 1}
            >
                <RouterLink to={"/"}>
                    <img className={classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                </RouterLink>
            </Grid>
            {getHeaderContent(props.connected || false)}
        </Grid>
    );
}