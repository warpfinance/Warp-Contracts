import * as React from "react";

import { InputAdornment, TextField } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

const styles = (theme: any) => createStyles({
    hideNumberPicker: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none"
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
        }
    },
    textField: {
        maxWidth: "150px",
    },
});


interface Props extends WithStyles<typeof styles> {
    adornment: string,
    id?: string,
    focusedAmountId?: string,
    onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onFocus?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    text?: string,
}

const DecoratedAmountClass = withStyles(styles)(
    class AmountClass extends React.Component<Props, {}> {
        render() {
            return (<TextField
                color="secondary"
                className={`${this.props.classes.textField} ${this.props.classes.hideNumberPicker}`}
                disabled={this.props.focusedAmountId !== undefined && this.props.id !== this.props.focusedAmountId}
                id={this.props.id}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{this.props.adornment}</InputAdornment>,
                }}
                margin="dense"
                onBlur={this.props.onBlur}
                onChange={this.props.onChange}
                onFocus={this.props.onFocus}
                placeholder={this.props.text ? this.props.text : "amount"}
                size="small"
                type="number"
                variant="outlined"
            />);
        }
    }
)

const Amount = connect(null, null)(DecoratedAmountClass)

export { Amount };