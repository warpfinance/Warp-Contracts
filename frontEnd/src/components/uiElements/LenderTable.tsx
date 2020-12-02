import * as React from "react";

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { BigNumber } from "ethers";
import { CustomButton } from "../../components"
import { LenderStableCoinRow } from "./LenderStableCoinRow";
import { RefreshToken } from "../../hooks/useRefreshToken";

interface Props {
    amountCurrency: string,
    amountValue: BigNumber,
    data: any,
    error: boolean,
    focusedAmountId: string | undefined,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
    onChange: any,
    onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    type: "lend" | "withdraw",
    refreshToken: RefreshToken
}

export const LenderTable: React.FC<Props> = (props: Props) => {
    const lendOrWithdraw = props.type === "withdraw" ? "withdraw" : "lend";

    return (
        <Grid
            container
            direction="column"
            alignItems="stretch"
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {props.type.charAt(0).toUpperCase() + props.type.slice(1)} assets
                                    </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Available
                                    </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    To {lendOrWithdraw}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row: any) => (
                            <LenderStableCoinRow 
                                token={row}
                                error={props.error}
                                focusedAmountId={props.focusedAmountId}
                                onBlur={props.onBlur}
                                onChange={props.onChange}
                                onFocus={props.onFocus}
                                type={props.type}
                                refreshToken={props.refreshToken}
                            />
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <CustomButton
                disabled={props.amountValue.lte(BigNumber.from(0)) || props.error}
                onClick={props.onButtonClick}
                text={lendOrWithdraw.charAt(0).toUpperCase() + lendOrWithdraw.slice(1)}
                type="long" />
        </Grid>
    );
}