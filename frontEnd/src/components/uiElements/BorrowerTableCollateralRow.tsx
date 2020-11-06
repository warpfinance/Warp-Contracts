import * as React from "react";
import { Token } from "../../util/token";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { CustomButton } from "..";

interface Props {
  token: Token,
  onLeftButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token) => void,
  onRightButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token) => void,
}

export const BorrowerTableCollateralRow: React.FC<Props> = (props: Props) => {
  const icon = <AvatarGroup max={2}>
    <Avatar alt={props.token.image} src={props.token.image} />;
    <Avatar alt={props.token.image2} src={props.token.image2} />;
  </AvatarGroup>

    const wrapMouseEventWithToken = (func: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token) => void) => {
        return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        func(event, props.token);
        }
    }

  const walletValueInUSD = '100';
  const walletAmount = '10';
  const providedValueInUSD = '50';
  const providedAmount = '5';

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