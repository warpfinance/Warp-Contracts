import * as React from "react";
import { Amount } from ".."

import { Avatar, Grid, TableCell, TableRow, Typography } from "@material-ui/core";
import { Token } from "../../util/token";
import { BigNumber, utils } from "ethers";
import { formatBigNumber } from "../../util/tools";

interface Props {
  token: Token,
  error: boolean,
  focusedAmountId: string | undefined,
  onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, maxAmount: BigNumber, token: Token)=> void,
  onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
  type: "lend" | "withdraw"
}

export const LenderStableCoinRow: React.FC<Props> = (props: Props) => {
  const lendOrWithdraw = props.type === "withdraw" ? "withdraw" : "lend";

  const icon = <Avatar alt={props.token.image} src={props.token.image} />;
  const currency = props.token.symbol;
  const available = utils.parseUnits('10.0', props.token.decimals);

  const onChangeWrapped: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    props.onChange(event, available, props.token);
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
                  {currency}
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
                      {formatBigNumber(available, props.token.decimals) + " " + currency}
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
              <Amount
                  adornment={currency}
                  focusedAmountId={props.focusedAmountId}
                  error={props.error}
                  id={currency}
                  onBlur={props.onBlur}
                  onChange={onChangeWrapped}
                  onFocus={props.onFocus} />
          </Grid>
      </TableCell>
    </TableRow>
  )
}