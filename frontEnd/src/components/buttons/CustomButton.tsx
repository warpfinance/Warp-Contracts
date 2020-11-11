import * as React from "react";

import { Avatar, Button } from "@material-ui/core";

import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    button: {
        textTransform: "none",
        borderRadius: "15px",
        "&:hover": {
            backgroundColor: "#62d066"
        }
    },
    routerLink: {
        textDecoration: 'none',
    }
}));

interface Props {
    text: string,
    type: "long" | "short",
    disabled?: boolean,
    externalHref?: boolean,
    href?: string,
    id?: string,
    iconSrc?: string,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    wallet?: boolean,
}

export const CustomButton: React.FC<Props> = (props: Props) => {

    const classes = useStyles();

    let border = "";
    let externalHref = { pathname: props.href };
    let color: "default" | "secondary" = "default";
    let icon = null;
    let minHeight = "";
    let minWidth = "";
    let pointerEvents = "auto";
    let variant: "contained" | "outlined" = "contained";
    if (props.type === "long") {
        minHeight = "50px";
        minWidth = "400px";
    }
    else {
        minHeight = "40px";
        minWidth = "140px";
    }

    if (props.wallet === true) {
        color = "secondary";
        icon = <Avatar className={classes.avatar} src={props.iconSrc} alt={props.iconSrc} />;
        pointerEvents = "none";
    }
    else if (props.disabled !== true) {
        border = "solid 2px #62d066";
        variant = "outlined";
    }

    const button = <Button
        color={color}
        className={classes.button}
        disabled={props.disabled}
        id={props.id}
        onClick={props.onClick}
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
        {props.text}
    </Button>;

    const content = !props.href ? button :
        <Link
            className={classes.routerLink}
            target={props.externalHref === true ? "_blank" : ""}
            to={props.externalHref === true ? externalHref : props.href}>
            {button}
        </Link>;

    return content;
}