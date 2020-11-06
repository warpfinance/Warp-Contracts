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

export const BorrowerTableLoanRow: React.FC<Props> = (props: Props) => {
  const icon = <Avatar alt={props.token.image} src={props.token.image} />;
  const amountDue = "0";

  const wrapMouseEventWithToken = (func: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token) => void) => {
      return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        func(event, props.token);
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
                        {amountDue + " " + props.token.symbol}
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
                        id={"repay" + props.token.symbol}
                        onClick={wrapMouseEventWithToken(props.onLeftButtonClick)}
                        text={"Repay"}
                        type="short" />
                </Grid>
                <Grid item>
                    <CustomButton
                        id={"borrow" + props.token.symbol}
                        onClick={wrapMouseEventWithToken(props.onRightButtonClick)}
                        text={"Borrow"}
                        type="short" />
                </Grid>
            </Grid>
        </TableCell>
    </TableRow>);
}