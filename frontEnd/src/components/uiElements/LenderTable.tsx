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
    onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
    onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    type: "lend" | "withdraw"
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
                                            {row.currency}
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
                                                {row.available.toLocaleString() + " " + row.currency}
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
                                            adornment={row.currency}
                                            focusedAmountId={props.focusedAmountId}
                                            error={props.error}
                                            id={row.currency}
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
            <CustomButton
                disabled={props.amountValue <= 0 || props.error}
                onClick={props.onButtonClick}
                text={lendOrWithdraw.charAt(0).toUpperCase() + lendOrWithdraw.slice(1)}
                type="long" />
        </Grid>
    );
}