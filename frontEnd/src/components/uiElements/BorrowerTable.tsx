import * as React from "react";

import { Amount, CustomButton } from "../../components"
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

interface Props {
    amountCurrency: string,
    amountValue: number,
    data: any,
    error: boolean,
    focusedAmountId: string | undefined,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    type: "collateral" | "borrow"
}

export const BorrowerTable: React.FC<Props> = (props: Props) => {
    const borrowOrBorrow = props.type === "borrow" ? "borrow" : "collateral";
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
                            <TableCell align="center">
                                <Typography variant="subtitle1" color="textSecondary">
                                    {props.type === "borrow" ? "Loan" : props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row: any) => (
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center"
                                        spacing={2}
                                    >

                                        {row.icon}
                                        <Typography variant="subtitle1">
                                            {props.type === "borrow" ? row.currency : row.name}
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
                                        {props.type === "borrow" ?
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.amount.toLocaleString() + " " + row.currency}
                                                </Typography>
                                            </Grid>
                                            : null
                                        }
                                        {props.type === "collateral" ?
                                            <Grid item>
                                                <Typography color="textSecondary">
                                                    {row.lp + " " + row.lpCurrency}
                                                </Typography>
                                            </Grid> :
                                            null
                                        }
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
                                                text={props.type === "collateral" ? "Withdraw" : props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                                                type="short" />
                                        </Grid>
                                        <Grid item>
                                            <CustomButton
                                                text={props.type === "collateral" ? "Provide" : "Repay"}
                                                type="short" />
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}