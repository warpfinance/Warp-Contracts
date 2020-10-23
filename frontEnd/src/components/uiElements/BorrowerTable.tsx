import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { CustomButton } from ".."
import { connect } from "react-redux";

//@ts-ignore
function createData(icon, wallet, walletCurrency) {
    return { icon, wallet, walletCurrency, };
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

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    type: "borrow" | "repay"
}

const DecoratedBorrowerTableClass = withStyles(styles)(
    class BorrowerTableClass extends React.Component<Props, {}> {
        render() {
            const data = this.props.type === "repay" ? withdrawData : lendData;
            const repayOrBorrow = this.props.type === "repay" ? "repay" : "borrow";

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
                                            Wallet
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
                                                    {row.walletCurrency}
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
                                                        {row.wallet.toLocaleString() + " " + row.walletCurrency}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>
                                            <Grid
                                                container
                                                direction="column"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <CustomButton text={"Enter amount"} type={"short"} />
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