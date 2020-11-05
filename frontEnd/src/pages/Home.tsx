import * as React from "react";

import { CustomButton, Header, SocialIcons } from "../components";

import { Grid } from "@material-ui/core";
import { makeStyles, } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    backgroundVideo: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        minWidth: '100%',
        minHeight: '100%',
        zIndex: 0,
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
}));

interface Props { }

export const Home: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <video autoPlay className={classes.backgroundVideo} muted loop>
                <source src="b2.webm" type="video/webm" />
            </video>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={10}
            >
                <Header home={true} />
                <div className={classes.centerButton}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="space-around"
                        spacing={5}
                    >
                        <Grid item>
                            <img className={classes.logo} src={"warp logo.svg"} alt={"Warp"}></img>
                        </Grid>
                        <Grid item>
                            <CustomButton href={"/connect"} text={"App"} type={"long"} />
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.bottomSocial}>
                    <SocialIcons />
                </div>
            </Grid >
        </React.Fragment>
    )
}