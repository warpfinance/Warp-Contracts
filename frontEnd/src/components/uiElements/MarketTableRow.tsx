import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenInterest } from "../../hooks/useTokenInterest"
import { useWarpControl } from "../../hooks/useWarpControl";
import { Token } from "../../util/token";
import * as React from 'react';

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

interface Props {
  type: "borrower" | "lender",
  token: Token
}


export const MarketTableRow: React.FC<Props> = (props: Props) => {
  const context = useConnectedWeb3Context();
  const {control} = useWarpControl(context);
  const {tokenBorrowRate, tokenSupplyRate} = useTokenInterest(control, props.token, context);
  
  // waiting on smart contracts
  const totalAmount = 0;

  const apy = props.type === "lender" ? tokenSupplyRate : tokenBorrowRate;

  const icon = <Avatar alt={props.token.image} src={props.token.image} />;

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
              </Grid>
          </Grid>
      </TableCell>
      <TableCell>
          <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
          >
              <Grid item>
                  <Typography variant="subtitle1">
                      {totalAmount.toLocaleString() + " " + props.token.symbol}
                  </Typography>
              </Grid>
          </Grid>
      </TableCell>
      <TableCell>
          <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
          >
              <Grid item>
                  <Typography variant="subtitle1">
                      {apy.toLocaleString(undefined, {maximumFractionDigits: 2}) + "%"}
                  </Typography>
              </Grid>
          </Grid>
      </TableCell>
    </TableRow>
  )
}