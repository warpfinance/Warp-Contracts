import * as React from "react";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { MigrateTableRow } from "../../components";
import { Token } from "../../util/token";

interface Props {
    onMigrateClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onWithdrawClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    type: "lending" | "borrowing"
    tokens: Token[]
}

export const MigrateTable: React.FC<Props> = (props: Props) => {
    const liquidityOrCollateral = props.type === "borrowing" ? "Collateral" : "Liquidity";

    return (
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
                                Wallet
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle1" color="textSecondary">
                                {liquidityOrCollateral}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tokens.map((token: Token) => (
                        <MigrateTableRow
                            onMigrateClick={props.onMigrateClick}
                            onWithdrawClick={props.onWithdrawClick}
                            type={props.type}
                            token={token}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}