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
    },
    textField: {
        maxWidth: "150px",
    },
}));


interface Props {
    adornment: string,
    id?: string,
    focusedAmountId?: string,
    onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onFocus?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    text?: string,
}

export const Amount: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    return (
        <TextField
            color="secondary"
            className={`${classes.textField} ${classes.hideNumberPicker}`}
            disabled={props.focusedAmountId !== "" && props.id !== props.focusedAmountId}
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
            type="number"
            variant="outlined"
        />);
}
