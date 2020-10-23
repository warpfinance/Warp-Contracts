import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

const DecoratedConnectModalClass = withStyles(styles)(
    class ConnectModalClass extends React.Component<Props, State> {
        render() {
            return null;
        }
    }
)

const ConnectModal = connect(null, null)(DecoratedConnectModalClass)

export { ConnectModal };