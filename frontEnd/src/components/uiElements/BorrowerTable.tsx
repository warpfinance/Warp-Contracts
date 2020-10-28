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
    type: "borrow" | "repay"
}

export const BorrowerTable: React.FC<Props> = (props: Props) => {
    const repayOrBorrow = props.type === "repay" ? "repay" : "borrow";
    const availableOrAmountDue = props.type === "repay" ? "Amount due" : "Available";

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
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    To {repayOrBorrow}
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
                                            {props.type === "repay" ? row.currency : row.name}
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
                                                {row.amount.toLocaleString() + " " + row.currency}
                                            </Typography>
                                        </Grid>
                                        {props.type === "borrow" ?
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
                                        direction="column"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Amount
                                            adornment={row.currency}
                                            focusedAmountId={props.focusedAmountId}
                                            error={props.error}
                                            id={props.type === "repay" ? row.currency : row.name}
                                            onBlur={props.onBlur}
                                            onChange={props.onChange}
                                            onFocus={props.onFocus} />
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <CustomButton disabled={props.amountValue <= 0 || props.error}
                onClick={props.onButtonClick}
                text={props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                type="long" />
        </Grid>
    );
}