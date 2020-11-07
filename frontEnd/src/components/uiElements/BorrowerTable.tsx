import * as React from "react";

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { CustomButton } from "../../components"
import { Token } from "../../util/token";
import { BorrowerTableLoanRow } from "./BorrowerTableLoanRow";
import { BorrowerTableCollateralRow } from "./BorrowerTableCollateralRow";

interface Props {
    tokens: Token[],
    usdc: Maybe<Token>,
    onLeftButtonClick: any,
    onRightButtonClick: any,
    type: "collateral" | "borrow"
}

export const BorrowerTable: React.FC<Props> = (props: Props) => {
    const availableOrAmountDue = props.type === "borrow" ? "Amount due" : "Available";

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
                                    {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {availableOrAmountDue}
                                </Typography>
                            </TableCell>
                            {props.type === "collateral" ?
                                <TableCell>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Provided
                                    </Typography>
                                </TableCell> :
                                null
                            }
                            <TableCell align="center">
                                <Typography variant="subtitle1" color="textSecondary">
                                    {props.type === "borrow" ? "Loan" : props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.tokens.map((token: Token) => {
                            if (props.type === "borrow") {
                                return (
                                    <BorrowerTableLoanRow
                                        token={token}
                                        onLeftButtonClick={props.onLeftButtonClick}
                                        onRightButtonClick={props.onRightButtonClick}
                                     />
                                )
                            } else {
                                return (
                                    <BorrowerTableCollateralRow
                                        token={token}
                                        usdc={props.usdc}
                                        onLeftButtonClick={props.onLeftButtonClick}
                                        onRightButtonClick={props.onRightButtonClick}
                                    />
                                )
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}