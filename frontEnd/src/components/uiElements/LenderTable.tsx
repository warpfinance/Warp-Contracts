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
    createData(<Avatar alt={"usd.png"} src={"usd.png"} />, 0, "USDC"),
];

const withdrawData = [
    createData(<Avatar alt={"dai.png"} src={"dai.png"} />, 100, "DAI"),
    createData(<Avatar alt={"usdt.png"} src={"usdt.png"} />, 25, "USDT"),
    createData(<Avatar alt={"usd.png"} src={"usd.png"} />, 68, "USDC"),
];

interface Props {
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    type: "lend" | "withdraw"
}

interface State {
    amountCurrency: string,
    amountValue: number,
    focusedAmountId: string | undefined,
}

export const LenderTable: React.FC<Props> = (props: Props) => {
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
            <CustomButton
                disabled={amountValue === 0}
                onClick={props.onButtonClick}
                text={lendOrWithdraw.charAt(0).toUpperCase() + lendOrWithdraw.slice(1)}
                type="long" />
        </Grid>
    );
}