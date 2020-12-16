import * as React from "react";

import { Avatar, Grid, TableCell, TableRow, Typography } from "@material-ui/core";

import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { CustomButton } from "..";
import { RefreshToken } from "../../hooks/useRefreshToken";
import { Token } from "../../util/token";
import { getEnv, parseBigNumber } from "../../util/tools";
import { useBorrowedAmount } from "../../hooks/useBorrowedAmount";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useTokenInterest } from "../../hooks/useTokenInterest";
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
    const { tokenBorrowRate } = useTokenInterest(control, props.token, context);
    const amountDue = parseBigNumber(borrowedAmount, props.token.decimals);

    const borrowForceDisabled = getEnv('REACT_APP_NO_BORROW') === '1';

    const wrapMouseEventWithToken = (func: any) => {
        return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            func(event, props.token, walletBalance, borrowedAmount);
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
                    <Grid item>
                        <Typography variant="subtitle1" color="textSecondary">
                            {tokenBorrowRate.toLocaleString(undefined, { minimumFractionDigits: 4 }) + "%"}
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
                                        disabled={value.countdown === true || amountDue === 0}
                                        id={"repay" + props.token.symbol}
                                        onClick={wrapMouseEventWithToken(props.onLeftButtonClick)}
                                        text={"Repay"}
                                        type="short" />
                                </Grid>
                                <Grid item>
                                    <CustomButton
                                        disabled={value.countdown === true || borrowForceDisabled}
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