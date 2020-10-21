import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { Header } from "../components";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
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

const DecoratedMarketsClass = withStyles(styles)(
    class MarketsClass extends React.Component<Props, {}> {
        render() {
            return (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={10}
                >
                    <Header home={true} />
                </Grid >
            )
        }
    }
)

const Markets = connect(null, null)(DecoratedMarketsClass)

export { Markets };