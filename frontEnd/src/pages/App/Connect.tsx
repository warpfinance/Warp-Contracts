import * as React from "react";

import { ConnectModal, CustomButton, Header } from "../../components";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    centerButton: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }
});

interface Props extends WithStyles<typeof styles> { }

interface State {
    modalOpen: boolean,
}

const DecoratedConnectClass = withStyles(styles)(
    class ConnectClass extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                modalOpen: false,
            };
            this.handleClose.bind(this)
        }

        handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
            this.setState({ modalOpen: false });
        }

        onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            this.setState({ modalOpen: true });
        }

        render() {
            return (
                <React.Fragment>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={10}
                    >
                        <Header />
                        <div className={this.props.classes.centerButton}>
                            <CustomButton onClick={this.onClick} text={"Connect wallet"} type={"long"} />
                        </div>
                    </Grid >
                    <ConnectModal handleClose={this.handleClose} open={this.state.modalOpen} />
                </React.Fragment>
            )
        }
    }
)

const Connect = connect(null, null)(DecoratedConnectClass)

export { Connect };