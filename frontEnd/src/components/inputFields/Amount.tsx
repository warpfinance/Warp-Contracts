import * as React from "react";

import { InputAdornment, TextField } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    textField: {
        maxWidth: "150px",
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
    text?: string,
    disabled?: boolean,
}

const DecoratedAmountClass = withStyles(styles)(
    class AmountClass extends React.Component<Props, {}> {
        render() {
            return (<TextField
                color="secondary"
                className={this.props.classes.textField}
                disabled={this.props.disabled}
                id="input"
                InputProps={{
                    endAdornment: <InputAdornment position="end">{this.props.adornment}</InputAdornment>,
                }}
                margin="dense"
                placeholder={this.props.text? this.props.text: "amount"}
                size="small"
                type="number"
                variant="outlined"
            />);
        }
    }
)

const Amount = connect(null, null)(DecoratedAmountClass)

export { Amount };