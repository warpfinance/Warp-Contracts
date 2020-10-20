import * as React from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    button: {
        textTransform: 'none',
    },
});

interface Props extends WithStyles<typeof styles> { }

const DecoratedConnectClass = withStyles(styles)(
    class ConnectClass extends React.Component<Props> {
        render() {
            return (
                <Button className={this.props.classes.button} style={{ textTransform: 'none' }} variant='outlined'>
                    Connect wallet
                </Button>
            )
        }
    }
)

const Connect = connect(null, null)(DecoratedConnectClass)

export { Connect };