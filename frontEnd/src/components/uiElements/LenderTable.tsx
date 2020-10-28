import * as React from "react";

import { Amount, CustomButton } from "../../components"
import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

//@ts-ignore
function createData(icon, available, currency) {
    return { icon, available, currency, };
}

const lendData = [
    createData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 0, "USDT"),
    createData(<Avatar alt={"usdc.png"} src={"usdc.png"} />, 0, "USDC"),
];

const withdrawData = [
    createData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 25, "USDT"),
    createData(<Avatar alt={"usdc.png"} src={"usdc.png"} />, 68, "USDC"),
];

interface Props {
    amountCurrency: string,
    amountValue: number,
    focusedAmountId: string | undefined,
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onBlur: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> void,
    onFocus: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    type: "lend" | "withdraw"
}

export const LenderTable: React.FC<Props> = (props: Props) => {
    const data = props.type === "withdraw" ? withdrawData : lendData;
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
                        {data.map((row) => (
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
                                            id={row.currency}
                                            focusedAmountId={props.focusedAmountId}
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
                disabled={props.amountValue === 0}
                onClick={props.onButtonClick}
                text={lendOrWithdraw.charAt(0).toUpperCase() + lendOrWithdraw.slice(1)}
                type="long" />
        </Grid>
    );
}