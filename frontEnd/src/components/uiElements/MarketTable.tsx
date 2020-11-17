import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { MarketTableRow } from "./MarketTableRow";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { Token } from "../../util/token";




interface Props {
    type: "borrower" | "lender"
}

export const MarketTable: React.FC<Props> = (props: Props) => {
    const supplyOrBorrow = props.type === "borrower" ? "borrow" : "supply";
    const context = useConnectedWeb3Context();
    const tokens = useStableCoinTokens(context);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1" color="textSecondary">
                                {props.type.charAt(0).toUpperCase() + props.type.slice(1)} market
                                    </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1" color="textSecondary">
                                Total {supplyOrBorrow}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1" color="textSecondary">
                                {props.type.charAt(0).toUpperCase() + props.type.slice(1)}  APY
                                    </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tokens.map((token: Token) => (
                        <MarketTableRow token={token} type={props.type} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}