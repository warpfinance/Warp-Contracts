import * as React from "react";

import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { Button } from "@material-ui/core";
import { Link } from 'react-router-dom';
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
    href?: string,
    wallet?: boolean,
}

const DecoratedButtonClass = withStyles(styles)(
    class ButtonClass extends React.Component<Props, {}> {
        render() {
            let border = "";
            let color: "default" | "secondary" = "default";
            let icon = null;
            let minHeight = "";
            let minWidth = "";
            let pointerEvents = "auto";
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
                icon = "Warp";
                pointerEvents = "none";
            }
            else if (this.props.disabled !== true) {
                border = "solid 2px #62d066";
                variant = "outlined";
            }

            const button = <Button
                color={color}
                className={this.props.classes.button}
                disabled={this.props.disabled}
                startIcon={icon}
                style={{
                    border: border,
                    minHeight: minHeight,
                    minWidth: minWidth,
                    // @ts-ignore
                    pointerEvents: pointerEvents,
                }}
                variant={variant}
            >
                {this.props.text}
            </Button>;

            const content = !this.props.href ? button :
                <Link to={this.props.href}>
                    {button}
                </Link>;

            return content;
        }
    }
)

const CustomButton = connect(null, null)(DecoratedButtonClass)

export { CustomButton };