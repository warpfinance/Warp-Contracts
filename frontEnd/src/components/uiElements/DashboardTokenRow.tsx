import { Avatar, Grid, TableCell, TableRow, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import { BigNumber } from "ethers";
import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { CustomButton } from "..";
import React from "react";
import { Token } from "../../util/token";
import { formatBigNumber } from "../../util/tools";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useTokenInterest } from "../../hooks/useTokenInterest";
import { useWarpControl } from "../../hooks/useWarpControl";

interface Props {
    token: Token
    buttonHref: string,
    buttonText: string,
    type: "lending" | "borrowing"
}

export const DashboardTableRow: React.FC<Props> = (props: Props) => {

    const context = useConnectedWeb3Context();
    const { walletBalance, vaultBalance } = useTokenBalance(props.token, context);
    const { control } = useWarpControl(context);
    const { tokenBorrowRate, tokenSupplyRate } = useTokenInterest(control, props.token, context);
    const uniVersion = props.token.lpType;

    const [availableAmount, setAvailableAmount] = React.useState(BigNumber.from(0));

    React.useEffect(() => {
        let available = walletBalance ? walletBalance : BigNumber.from(0);

        setAvailableAmount(available);
    }, [walletBalance, vaultBalance]);

    let icon: any;
    if (props.type === "lending") {
        icon = <Avatar alt={props.token.image} src={props.token.image} />;
    } else {
        icon = <AvatarGroup max={2}>
            <Avatar alt={props.token.image} src={props.token.image} />;
      <Avatar alt={props.token.image2} src={props.token.image2} />;
    </AvatarGroup>
    }

    return (
        <TableRow>
            <TableCell>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >

                    {icon}
                    <Grid
                        item
                        direction="column"
                    >
                        <Grid item>
                            <Typography variant="subtitle1">
                                {props.token.symbol}
                            </Typography>
                        </Grid>
                        {
                            (props.type === "lending") ? (
                                <Grid item>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {tokenSupplyRate.toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%"}
                                    </Typography>
                                </Grid>
                            ) : null
                        }
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <Typography variant="subtitle1">
                            {formatBigNumber(availableAmount, props.token.decimals) + " " + props.token.symbol}
                        </Typography>
                    </Grid>
                    {props.type === "borrowing" ?
                        <Grid item>
                            <Typography color="textSecondary">
                                {uniVersion}
                            </Typography>
                        </Grid> :
                        null
                    }
                </Grid>
            </TableCell>
            <TableCell>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <BorrowerCountdownContext.Consumer>
                        {value =>
                            <CustomButton
                                disabled={props.type === "borrowing" && value.countdown === true}
                                href={props.buttonHref}
                                text={props.buttonText}
                                type={"short"} />
                        }
                    </BorrowerCountdownContext.Consumer>
                </Grid>
            </TableCell>
        </TableRow>
    )
}