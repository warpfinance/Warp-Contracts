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
                    alignItems="center"
                    spacing={10}
                >
                    <Header />
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <CustomButton text={"Connect wallet"} type={"long"} />
                    </div>
                </Grid >
            )
        }
    }
)

const Connect = connect(null, null)(DecoratedConnectClass)

export { Connect };