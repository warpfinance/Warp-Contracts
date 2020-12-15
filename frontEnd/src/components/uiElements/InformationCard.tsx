import * as React from "react";

import { Card, CardContent, Grid, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    InformationCard: {
        minWidth: "300px"
    }
}))

interface Props {
    header: string,
    text: string
}

export const InformationCard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.InformationCard}>
            <CardContent>
                <Grid
                    container
                    direction="column"
                    justify="space-around"
                    alignItems="center"
                >
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.header}
                    </Typography>
                    <Typography variant="h4">
                        {props.text}
                    </Typography>
                </Grid>
            </CardContent>
        </Card>
    )
}
