import * as React from "react";

import { Amount, CustomButton } from "../../components"
import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { AvatarGroup } from "@material-ui/lab";
import { connect } from "react-redux";

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
    createRepayData(<Avatar alt={"usd.png"} src={"usd.png"} />, 68, "USDC"),
];

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    type: "borrow" | "repay"
}

const DecoratedBorrowerTableClass = withStyles(styles)(
    class BorrowerTableClass extends React.Component<Props, {}> {
        render() {
            const data = this.props.type === "repay" ? repayData : borrowData;
            const repayOrBorrow = this.props.type === "repay" ? "repay" : "borrow";
            const availableOrAmountDue = this.props.type === "repay" ? "Amount due" : "Available";

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
                                            {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)}
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
                                                    {this.props.type === "repay" ? row.currency : row.name}
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
                                                {this.props.type === "borrow" ?
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
                                                <Amount adornment={row.currency} />
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CustomButton text={this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} type="long" />
                </Grid>
            );
        }
    }
)

const BorrowerTable = connect(null, null)(DecoratedBorrowerTableClass)

export { BorrowerTable };