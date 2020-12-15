import { DialogTitle, IconButton, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
}));

interface Props {
    children: any,
    onClose: any,
    closeDisabled?: boolean,
}

export const CustomDialogTitle: React.FC<any> = (props: Props) => {
    const classes = useStyles();
    return (
        <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{props.children}</Typography>
            <IconButton
                aria-label="close"
                className={classes.closeButton}
                disabled={props.closeDisabled}
                onClick={props.closeDisabled === true ? undefined : props.onClose}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
}