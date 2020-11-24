import * as React from "react";
import { Token } from "../../util/token";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { CustomButton } from "..";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { formatBigNumber, parseBigNumber } from "../../util/tools";
import { useTokenValue } from "../../hooks/useTokenValue";
import { useWarpControl } from "../../hooks/useWarpControl";
import { BigNumber } from "ethers";
import { RefreshToken } from "../../hooks/useRefreshToken";

interface Props {
  token: Token,
  usdc: Maybe<Token>,
  onLeftButtonClick: any,
  onRightButtonClick: any,
  refreshToken: RefreshToken
}



export const BorrowerTableCollateralRow: React.FC<Props> = (props: Props) => {
    const icon = <AvatarGroup max={2}>
        <Avatar alt={props.token.image} src={props.token.image} />;
        <Avatar alt={props.token.image2} src={props.token.image2} />;
    </AvatarGroup>

    const context = useConnectedWeb3Context();
    const {walletBalance, vaultBalance} = useTokenBalance(props.token, context, props.refreshToken);
    const {control} = useWarpControl(context);
    const {tokenValueInUSDC} = useTokenValue(control, props.token, context);

    console.log(props.token.symbol, tokenValueInUSDC.toString());

    const walletAmount = parseBigNumber(walletBalance, props.token.decimals).toLocaleString(undefined, {maximumFractionDigits: 8});
    const providedAmount = parseBigNumber(vaultBalance, props.token.decimals).toLocaleString(undefined, {maximumFractionDigits: 8});
    
    const calculateValueInUSDC = (amount: BigNumber, value: BigNumber, usdc: Maybe<Token>) => {
        if (!usdc) {
            return '';
        }
        const estimateAmount = parseBigNumber(amount, props.token.decimals);
        const estimateValue = parseBigNumber(value, usdc.decimals);

        return (estimateAmount * estimateValue).toLocaleString(undefined, {maximumFractionDigits: 2});
    }

    let walletValueInUSD = calculateValueInUSDC(walletBalance, tokenValueInUSDC, props.usdc);
    let providedValueInUSD = calculateValueInUSDC(vaultBalance, tokenValueInUSDC, props.usdc);

    const wrapMouseEventWithToken = (func: any) => {
        return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            func(event, props.token, walletBalance, vaultBalance);
        }
    }
    

    return (<TableRow>
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
                        {walletValueInUSD + " USD"}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography color="textSecondary">
                        {walletAmount + " LP"}
                    </Typography>
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
                        {providedValueInUSD + " USD"}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography color="textSecondary">
                        {providedAmount + " LP"}
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
                <Grid item>
                    <CustomButton
                        id={"provide" + props.token.symbol}
                        onClick={wrapMouseEventWithToken(props.onLeftButtonClick)}
                        text={"Provide"}
                        type="short" />
                </Grid>
                <Grid item>
                    <CustomButton
                        id={"withdraw" + props.token.symbol}
                        onClick={wrapMouseEventWithToken(props.onRightButtonClick)}
                        text={"Withdraw"}
                        type="short" />
                </Grid>
            </Grid>
        </TableCell>
    </TableRow>);
}