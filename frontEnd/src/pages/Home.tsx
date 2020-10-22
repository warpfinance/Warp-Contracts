import * as React from "react";

import { CustomButton, Header, SocialIcons } from "../components";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    backgroundVideo: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        minWidth: '100%',
        minHeight: '100%',
        zIndex: -1,
    },
    bottomSocial: {
        position: 'absolute',
        left: '50%',
        top: '85%',
        transform: 'translate(-50%, -50%)'
    },
    centerButton: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    logo: {
        maxHeight: '65.8px'
    },
});

interface Props extends WithStyles<typeof styles> { }

const DecoratedHomeClass = withStyles(styles)(
    class HomeClass extends React.Component<Props, {}> {
        render() {
            return (
                <React.Fragment>
                    <video autoPlay className={this.props.classes.backgroundVideo} muted loop>
                        <source src="b2.webm" type="video/webm" />
                    </video>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={10}
                    >
                        <Header home={true} />
                        <div className={this.props.classes.centerButton}>
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justify="space-around"
                                spacing={5}
                            >
                                <Grid item>
                                    <img className={this.props.classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                                </Grid>
                                <Grid item>
                                    <CustomButton href={"/connect"} text={"App"} type={"long"} />
                                </Grid>
                            </Grid>
                        </div>
                        <div className={this.props.classes.bottomSocial}>
                            <SocialIcons />
                        </div>
                    </Grid >
                </React.Fragment>
            )
        }
    }
)

const Home = connect(null, null)(DecoratedHomeClass)

export { Home };