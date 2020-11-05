import * as React from "react";

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { CustomButton } from "../../components"

interface Props {
    data: any,
    onLeftButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onRightButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
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
                                            {props.type === "borrow" ?
                                                row.currency
                                                :
                                                row.pool
                                            }
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
                                            :
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.available.toLocaleString() + " " + row.currency}
                                                </Typography>
                                            </Grid>
                                        }
                                        {props.type === "collateral" ?
                                            <Grid item>
                                                <Typography color="textSecondary">
                                                    {row.availableLp + " " + row.lpCurrency}
                                                </Typography>
                                            </Grid> :
                                            null
                                        }
                                    </Grid>
                                </TableCell>
                                {props.type === "collateral" ?
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="flex-start"
                                        >
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.provided.toLocaleString() + " " + row.currency}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography color="textSecondary">
                                                    {row.providedLp + " " + row.lpCurrency}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell> :
                                    null
                                }
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
                                                id={props.type === "borrow" ?
                                                    row.currency
                                                    :
                                                    row.pool
                                                }
                                                onClick={props.onLeftButtonClick}
                                                text={props.type === "collateral" ? "Provide" : "Repay"}
                                                type="short" />
                                        </Grid>
                                        <Grid item>
                                            <CustomButton
                                                id={props.type === "borrow" ?
                                                    row.currency
                                                    :
                                                    row.pool
                                                }
                                                onClick={props.onRightButtonClick}
                                                text={props.type === "collateral" ? "Withdraw" : props.type.charAt(0).toUpperCase() + props.type.slice(1)}
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