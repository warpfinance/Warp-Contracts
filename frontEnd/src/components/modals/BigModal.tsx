import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

const DecoratedBigModalClass = withStyles(styles)(
    class BigModalClass extends React.Component<Props, State> {
        render() {
            return null;
        }
    }
)

const BigModal = connect(null, null)(DecoratedBigModalClass)

export { BigModal };