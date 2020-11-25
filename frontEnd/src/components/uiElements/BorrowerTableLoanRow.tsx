import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { CustomButton } from "..";
import { RefreshToken } from "../../hooks/useRefreshToken";
import { Token } from "../../util/token";
import { parseBigNumber } from "../../util/tools";
import { useBorrowedAmount } from "../../hooks/useBorrowedAmount";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useWarpControl } from "../../hooks/useWarpControl";

interface Props {
    token: Token,
    onLeftButtonClick: any,
    onRightButtonClick: any,
    refreshToken: RefreshToken
}

export const BorrowerTableLoanRow: React.FC<Props> = (props: Props) => {
    const icon = <Avatar alt={props.token.image} src={props.token.image} />;
    const context = useConnectedWeb3Context();
    const { control } = useWarpControl(context);
    const borrowedAmount = useBorrowedAmount(context, control, props.token, props.refreshToken);
    const { walletBalance } = useTokenBalance(props.token, context, props.refreshToken);

    const amountDue = parseBigNumber(borrowedAmount, props.token.decimals);

    const wrapMouseEventWithToken = (func: any) => {
        return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            func(event, props.token, walletBalance);
        }
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
                    <Typography variant="subtitle1">
                        {props.token.symbol}
                    </Typography>
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
                            {amountDue.toLocaleString(undefined, { maximumFractionDigits: 4 }) + " " + props.token.symbol}
                        </Typography>
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <BorrowerCountdownContext.Consumer>
                        {value =>
                            <React.Fragment>
                                <Grid item>
                                    <CustomButton
                                        disabled={value.countdown === true}
                                        id={"repay" + props.token.symbol}
                                        onClick={wrapMouseEventWithToken(props.onLeftButtonClick)}
                                        text={"Repay"}
                                        type="short" />
                                </Grid>
                                <Grid item>
                                    <CustomButton
                                        disabled={value.countdown === true}
                                        id={"borrow" + props.token.symbol}
                                        onClick={wrapMouseEventWithToken(props.onRightButtonClick)}
                                        text={"Borrow"}
                                        type="short" />
                                </Grid>
                            </React.Fragment>
                        }
                    </BorrowerCountdownContext.Consumer>
                </Grid>
            </TableCell>
        </TableRow>);
}