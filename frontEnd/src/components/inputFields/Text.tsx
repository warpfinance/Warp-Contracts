import * as React from "react";

import { TextField } from "@material-ui/core";
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
    disabled?: boolean,
    fullWidth?: boolean,
    error?: boolean,
    id?: string,
    onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onFocus?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    text?: string,
    value?: any,
}

export const Text: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    let maxWidth = "330px";
    const value = props.value !== undefined ? props.value : undefined;

    if (props.fullWidth === true) {
        maxWidth = "";
    }

    return (
        <TextField
            color="secondary"
            className={classes.hideNumberPicker}
            disabled={props.disabled || false}
            error={props.error}
            id={props.id}
            margin="dense"
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
            placeholder={props.text ? props.text : "text"}
            size="small"
            style={{
                maxWidth: maxWidth
            }}
            variant="outlined"
            value={value}
        />);
}
