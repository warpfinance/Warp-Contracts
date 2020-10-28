import * as React from "react";

import { Amount, CustomButton } from "../../components"
import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";

//@ts-ignore
function createBorrowData(icon, name, supplyShare, amount, currency, lp, lpCurrency) {
    return { icon, name, supplyShare, amount, currency, lp, lpCurrency };
}

//@ts-ignore
function createRepayData(icon, amount, currency) {
    return { icon, amount, currency, };
}

const borrowData = [
    createBorrowData(<AvatarGroup max={2}><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"dai.png"} src={"dai.png"} /></AvatarGroup>,
        "ETH - DAI", 1.97, 765, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"eth.png"} src={"eth.png"} />
        <Avatar alt={"usdt.png"} src={"usdt.png"} /></AvatarGroup>,
        "ETH - USDT", 3.25, 345, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"wbtc.png"} src={"wbtc.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "wBTC - wETH", 1.32, 765, "USD", 400, "LP"),
    createBorrowData(<AvatarGroup><Avatar alt={"usdt.png"} src={"usdt.png"} />
        <Avatar alt={"weth.png"} src={"weth.png"} /></AvatarGroup>,
        "USDT - wETH", 2.18, 456, "USD", 400, "LP"),
];

const repayData = [
    createRepayData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createRepayData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 249, "USDT"),
    createRepayData(<Avatar alt={"usdc.png"} src={"usdc.png"} />, 68, "USDC"),
];

interface Props {
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    type: "borrow" | "repay"
}

export const BorrowerTable: React.FC<Props> = (props: Props) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [amountCurrency, setAmountCurrency] = React.useState("");
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [amountValue, setAmountValue] = React.useState(0);
    const [focusedAmountId, setFocusedAmountId] = React.useState("");

    const onBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (amountValue === 0) {
            setFocusedAmountId("");
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // TO-DO: Input validation
        setAmountCurrency(event.target.id);
        setAmountValue(Number(event.target.value));
        setFocusedAmountId(event.target.id);
    };

    const onFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event !== null && event !== undefined && focusedAmountId !== event.target.id) {
            setFocusedAmountId(event.target.id);
        }
    };

    const data = props.type === "repay" ? repayData : borrowData;
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
                        {data.map((row: any) => (
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
                                            id={props.type === "repay" ? row.currency : row.name}
                                            focusedAmountId={focusedAmountId}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            onFocus={onFocus} />
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <CustomButton disabled={amountValue === 0}
                onClick={props.onButtonClick}
                text={props.type.charAt(0).toUpperCase() + props.type.slice(1)}
                type="long" />
        </Grid>
    );
}