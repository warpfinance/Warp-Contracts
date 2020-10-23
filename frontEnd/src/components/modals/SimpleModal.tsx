import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

const DecoratedSimpleModalClass = withStyles(styles)(
    class SimpleModalClass extends React.Component<Props, State> {
        render() {
            return null;
        }
    }
)

const SimpleModal = connect(null, null)(DecoratedSimpleModalClass)

export { SimpleModal };