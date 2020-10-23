import * as React from "react";

import { InputAdornment, TextField } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    textField: {
        textTransform: "none",
        borderRadius: "15px",
        margin: 0,
        "& -webkit-inner-spin-button": {
            WebkitAppearance: "none",
        },
        "& -webkit-outer-spin-button": {
            WebkitAppearance: "none",
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
        }
    },
});


interface Props extends WithStyles<typeof styles> {
    adornment: string,
    text: string,
    type: "long" | "short",
    disabled?: boolean,
}

const DecoratedAmountClass = withStyles(styles)(
    class AmountClass extends React.Component<Props, {}> {
        render() {
            let border = "";
            let icon = null;
            let minHeight = "";
            let minWidth = "";
            let pointerEvents = "auto";
            if (this.props.type === "long") {
                minHeight = "50px";
                minWidth = "400px";
            }
            else {
                minHeight = "40px";
                minWidth = "140px";
            }

            if (this.props.disabled !== true) {
                //border = "solid 2px #62d066";
            }

            return (<TextField
                className={this.props.classes.textField}
                disabled={this.props.disabled}
                id="input"
                InputProps={{
                    endAdornment: <InputAdornment position="end">{this.props.adornment}</InputAdornment>,
                }}
                placeholder={this.props.text}
                startIcon={icon}
                style={{
                    border: border,
                    minHeight: minHeight,
                    minWidth: minWidth,
                    // @ts-ignore
                    pointerEvents: pointerEvents,
                }}
                type="number"
            />);
        }
    }
)

const Amount = connect(null, null)(DecoratedAmountClass)

export { Amount };