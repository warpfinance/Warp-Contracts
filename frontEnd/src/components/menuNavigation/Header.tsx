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


interface Props extends WithStyles<typeof styles> { }

const DecoratedHeaderClass = withStyles(styles)(
    class HeaderClass extends React.Component<Props, {}> {
        render() {
            return (
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid
                        item
                        md={7}
                    >
                        <img className={this.props.classes.logo} src={"warp logo.svg"}></img>
                    </Grid>
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
                        <CustomButton disabled={true} text={"0.0"} type={"short"} />
                    </Grid>
                    <Grid
                        item
                        md
                    >
                        <CustomButton disabled={true} text={"No wallet"} type={"short"} />
                    </Grid>
                </Grid>
            );
        }
    }
)

const Header = connect(null, null)(DecoratedHeaderClass)

export { Header };