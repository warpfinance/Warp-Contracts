import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { CustomButton } from "../../components";
import { connect } from "react-redux";
import { Token } from "../../util/token";
import { DashboardTableRow } from "./DashboardTokenRow";

interface Props  {
    type: "lending" | "borrowing"
    tokens: Token[]
}

export const DashboardTable: React.FC<Props> = (props: Props) => {
    const buttonHref = props.type === "borrowing" ? "/borrower" : "/lender";
    const buttonText = props.type === "borrowing" ? "Borrow" : "Lend";
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
                        <TableCell>
                            <Typography variant="subtitle1" color="textSecondary">
                                {liquidityOrCollateral}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tokens.map((token: Token) => (
                        <DashboardTableRow
                            buttonHref={buttonHref}
                            buttonText={buttonText}
                            type={props.type}
                            token={token}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}