import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Button } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    button: {
        textTransform: "none",
        borderRadius: "15px",
        "&:hover": {
            backgroundColor: "#62d066"
        }
    },
});


interface Props extends WithStyles<typeof styles> {
    text: string,
    type: "long" | "short",
    disabled?: boolean,
    wallet?: boolean,
}

const DecoratedButtonClass = withStyles(styles)(
    class ButtonClass extends React.Component<Props, {}> {
        render() {
            let color: "default" | "secondary" = "default";
            let border = "";
            let minHeight = "";
            let minWidth = "";
            let variant: "contained" | "outlined" = "contained"
            if (this.props.type === "long") {
                minHeight = "50px";
                minWidth = "400px";
            }
            else {
                minHeight = "40px";
                minWidth = "140px";
            }

            if (this.props.wallet === true) {
                color = "secondary";
            }
            else if (this.props.disabled !== true) {
                border = "solid 2px #62d066";
                variant = "outlined";
            }

            return (
                <Button
                    color={color}
                    className={this.props.classes.button}
                    disabled={this.props.disabled}
                    style={{
                        border: border,
                        minHeight: minHeight,
                        minWidth: minWidth,
                    }}
                    variant={variant}
                >
                    {this.props.text}
                </Button>
            )
        }
    }
)

const CustomButton = connect(null, null)(DecoratedButtonClass)

export { CustomButton };