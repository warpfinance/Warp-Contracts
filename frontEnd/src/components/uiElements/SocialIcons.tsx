import * as React from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    hrefText: {
        color: "#FFFFFF",
        textDecoration: 'none'
    }
}));

interface Props { }

const imgSrcs = [
    { hover: "twitterHover.svg", unHover: "twitter.svg", href: "https://twitter.com/warpfinance", alt: "Twitter" },
    { hover: "mediumHover.svg", unHover: "medium.svg", href: "https://medium.com/@warpfinance", alt: "Medium" },
    { hover: "telegramHover.svg", unHover: "telegram.svg", href: "https://t.me/warp_official", alt: "Telegram" },
    { hover: "discordHover.svg", unHover: "discord.svg", href: "https://discord.com/invite/TYuz9yV", alt: "Discord" },
]

export const SocialIcons: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const getIcons = () => {
        let icons: any = [];
        imgSrcs.forEach((imgSrcs, index: number) => {
            icons.push(
                <Grid item>
                    <a className={classes.hrefText} href={imgSrcs.href}>
                        <img
                            src={imgSrcs.unHover}
                            alt={imgSrcs.alt}
                            onMouseOver={(event) => hover(event, index)}
                            onMouseOut={(event) => unHover(event, index)}
                        />
                    </a>
                </Grid>
            );
        })
        return icons;
    }

    const hover = (element: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number) => {
        element.currentTarget.setAttribute('src', imgSrcs[index].hover);
    }

    const unHover = (element: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number) => {
        element.currentTarget.setAttribute('src', imgSrcs[index].unHover);
    }

    const icons = getIcons();

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            justify="center"
            spacing={10}
        >
            {icons}
        </Grid>
    )
}