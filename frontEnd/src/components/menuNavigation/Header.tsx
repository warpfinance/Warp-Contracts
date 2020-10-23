import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { CustomButton } from "../../components"
import { Link as RouterLink } from 'react-router-dom';
import { connect } from "react-redux";

const data = {
    walletAddress: '0xeB31973E0FeBF3e3D7058234a5eBbAe1aB4B8c23',
    walletBalance: 0.0,
}

const styles = (theme: any) => createStyles({
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
});


interface Props extends WithStyles<typeof styles> {
    connected?: boolean
    home?: boolean
}

const DecoratedHeaderClass = withStyles(styles)(
    class HeaderClass extends React.Component<Props, {}> {
        truncate = (input: string) => {
            if (input.length > 5) {
                return input.substring(0, 5) + '...';
            }
            return input;
        };


        getHeaderContent = (connected: boolean) => {
            const connectButton =
                <CustomButton disabled={true} text={!connected ? "No wallet" : this.truncate(data.walletAddress)} type={"short"} />

            if (!this.props.home) {
                return (
                    <React.Fragment>
                        <Grid
                            item
                            md
                        >
                            <Typography>
                                <RouterLink className={this.props.classes.routerLink} to={"/dashboard"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="" underline="none">
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
                                <RouterLink className={this.props.classes.routerLink} to={"/connect"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="" underline="none">
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
                                <RouterLink className={this.props.classes.routerLink} to={"/connect"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="" underline="none">
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
                                <RouterLink className={this.props.classes.routerLink} to={"/connect"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="" underline="none">
                                        Vote
                                    </Link>
                                </RouterLink>
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
                                <RouterLink className={this.props.classes.routerLink} to={"/markets"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                        Markets
                                    </Link>
                                </RouterLink>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                        >
                            <Typography>
                                <RouterLink className={this.props.classes.routerLink} to={"/"}>
                                    <Link className={this.props.classes.link} color="textSecondary" href="" underline="none">
                                        Docs
                                    </Link>
                                </RouterLink>
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

        render() {
            return (
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={(!this.props.home) ? 3 : 1}
                >
                    <Grid
                        item
                        md={(!this.props.home) ? 5 : 1}
                    >
                        <RouterLink to={"/"}>
                            <img className={this.props.classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                        </RouterLink>
                    </Grid>
                    {this.getHeaderContent(this.props.connected || false)}
                </Grid>
            );
        }
    }
)

const Header = connect(null, null)(DecoratedHeaderClass)

export { Header };