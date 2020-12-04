import * as React from "react";

import { Avatar, Grid, TableCell, TableRow, Typography } from "@material-ui/core";
import { BigNumber, utils } from "ethers";

import { Amount } from ".."
import { RefreshToken } from "../../hooks/useRefreshToken";
import { Token } from "../../util/token";
import { formatBigNumber } from "../../util/tools";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useTokenInterest } from "../../hooks/useTokenInterest";
import { useWarpControl } from "../../hooks/useWarpControl";

interface Props {
  token: Token,
  error: boolean,
  focusedAmountId: string | undefined,
  onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, maxAmount: BigNumber, token: Token) => void,
  onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
  type: "lend" | "withdraw",
  refreshToken: RefreshToken
}

export const LenderStableCoinRow: React.FC<Props> = (props: Props) => {
  const lendOrWithdraw = props.type === "withdraw" ? "withdraw" : "lend";

  const icon = <Avatar alt={props.token.image} src={props.token.image} />;
  const currency = props.token.symbol;


  const [enteredValue, setEnteredValue] = React.useState("");

  const [availableAmount, setAvailableAmount] = React.useState(BigNumber.from(0));

  const context = useConnectedWeb3Context();
  const { walletBalance, vaultBalance } = useTokenBalance(props.token, context, props.refreshToken);
  const { control } = useWarpControl(context);
  const { tokenSupplyRate } = useTokenInterest(control, props.token, context);

  React.useEffect(() => {
    let available = BigNumber.from(0);

    if (lendOrWithdraw === 'withdraw') {
      available = vaultBalance !== null ? vaultBalance : available;
    } else {
      available = walletBalance !== null ? walletBalance : available;
    }

    setAvailableAmount(available);
  }, [walletBalance, vaultBalance]);

  React.useEffect(() => {
    setEnteredValue("");
  }, [props.refreshToken])

  const onChangeWrapped = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEnteredValue(event.target.value);
    props.onChange(event, availableAmount, props.token);
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
              {formatBigNumber(availableAmount, props.token.decimals) + " " + currency}
            </Typography>
          </Grid>
          {lendOrWithdraw === "lend" ?
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                {tokenSupplyRate.toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%"}
              </Typography>
            </Grid>
            :
            null
          }
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
            value={enteredValue}
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