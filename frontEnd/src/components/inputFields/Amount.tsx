import * as React from "react";

import { InputAdornment, TextField } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    hideNumberPicker: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none"
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
        }
    }
}));


interface Props {
    adornment: string,
    focusedAmountId?: string,
    fullWidth?: boolean,
    error?: boolean,
    id?: string,
    onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onFocus?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    text?: string,
    value?: any,
}

export const Amount: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    let maxWidth = "160px";
    const value = props.value !== undefined ? props.value : null;

    if (props.fullWidth === true) {
        maxWidth = "";
    }

    return (
        <TextField
            color="secondary"
            className={classes.hideNumberPicker}
            disabled={props.focusedAmountId !== "" && props.id !== props.focusedAmountId}
            error={props.error}
            id={props.id}
            InputProps={{
                endAdornment: <InputAdornment position="end">{props.adornment}</InputAdornment>,
            }}
            margin="dense"
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
            placeholder={props.text ? props.text : "amount"}
            size="small"
            style={{
                maxWidth: maxWidth
            }}
            type="number"
            variant="outlined"
            value={value}
        />);
}
