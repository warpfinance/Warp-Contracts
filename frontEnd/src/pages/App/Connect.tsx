import * as React from "react";

import { CustomButton, Header } from "../../components";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({

});

interface Props extends WithStyles<typeof styles> { }

const DecoratedConnectClass = withStyles(styles)(
    class ConnectClass extends React.Component<Props> {
        render() {
            return (
                <Grid
                    container
                    direction="column"
                    justify="space-between"
                    alignItems="center"
                    spacing={10}
                >
                    <Header />
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="center"
                        item
                    >
                        <CustomButton disabled={false} text={"Connect wallet"} type={"long"} />
                    </Grid>
                </Grid>
            )
        }
    }
)

const Connect = connect(null, null)(DecoratedConnectClass)

export { Connect };