import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { CustomButton } from "../../components"
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    logo: {
        maxHeight: '36px'
    },
    link: {
        "&:hover": {
            color: "#FFFFFF",
        }
    },
});


interface Props extends WithStyles<typeof styles> {
    home?: boolean
}

const DecoratedHeaderClass = withStyles(styles)(
    class HeaderClass extends React.Component<Props, {}> {
        getHeaderContent = () => {
            if (!this.props.home) {
                return (
                    <React.Fragment>
                        <Grid
                            item
                            md
                        >
                            <Typography>
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Dashboard
                        </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md
                        >
                            <Typography>
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Lender
                        </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md
                        >
                            <Typography>
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Borrower
                        </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md
                        >
                            <Typography>
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Vote
                        </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md
                        >
                            <CustomButton disabled={false} text={"0.0"} type={"short"} wallet={true} />
                        </Grid>
                        <Grid
                            item
                            md
                        >
                            <CustomButton disabled={true} text={"No wallet"} type={"short"} />
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
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Markets
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                        >
                            <Typography>
                                <Link className={this.props.classes.link} color="textSecondary" href="#" underline="none">
                                    Docs
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                        >
                            <CustomButton text={"App"} type={"short"} />
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
                    justify="space-around"
                    alignItems="center"
                    spacing={(!this.props.home)? 3: 1}
                >
                    <Grid
                        item
                        md={(!this.props.home)? 7: 1}
                    >
                        <img className={this.props.classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                    </Grid>
                    {this.getHeaderContent()}
                </Grid>
            );
        }
    }
)

const Header = connect(null, null)(DecoratedHeaderClass)

export { Header };