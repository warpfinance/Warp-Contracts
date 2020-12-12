import * as React from "react";

import { CustomButton, Header } from "../../components";
import { Grid, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
}))

interface Props {
}

export const Migrate: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={5}
            >
                <Header />
                <Grid item>
                    <Typography variant="h5">
                        Migrate to v2 for further LP support
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                        Users can either choose to withdraw funds, or continue exploring Warp with v1
                    </Typography>
                </Grid>
                <Grid item>
                    <CustomButton text="Migrate to V2" type="long" />
                </Grid>
            </Grid >
        </React.Fragment>
    )
}