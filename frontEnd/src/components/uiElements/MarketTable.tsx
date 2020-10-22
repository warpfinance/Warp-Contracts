import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

//@ts-ignore
function createData(icon, name, supplyShare, totalSupply, totalSupplyCurrency, totalSupplyChange, supplyApy, supplyApychange) {
    return { icon, name, supplyShare, totalSupply, totalSupplyCurrency, totalSupplyChange, supplyApy, supplyApychange };
}

const rows = [
    createData('dai.png', 'Dai', 3.40, 125, 'DAI', 2.56, 3.67, -2.13),
    createData('usdt.png', 'Tether', 3.40, 125, 'DAI', 2.56, 3.67, -2.13),
    createData('usd.png', 'USD Coin', 3.40, 125, 'DAI', 2.56, 3.67, -2.13),
];


const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    type: "borrower" | "lender"
}

const DecoratedMarketTableClass = withStyles(styles)(
    class MarketTableClass extends React.Component<Props, {}> {
        render() {
            const supplyOrBorrow = this.props.type === "borrower" ? "borrow" : "supply";
            return (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} market
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Total {supplyOrBorrow}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)}  APY
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell align="left">
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Avatar alt={row.name} src={row.icon} />
                                            </Grid>
                                            <Grid
                                                item
                                                direction="column"
                                            >
                                                <Grid item>
                                                    <Typography variant="subtitle1">
                                                        {row.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        {row.supplyShare + "%"}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.totalSupply.toLocaleString() + " " + row.totalSupplyCurrency}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" color={row.totalSupplyChange > 0 ? "secondary" : "error"} >
                                                    {row.totalSupplyChange > 0 ? `+${row.totalSupplyChange}%` : `${row.totalSupplyChange}%`}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.supplyApy + "%"}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" color={row.supplyApychange > 0 ? "secondary" : "error"} >
                                                    {row.supplyApychange > 0 ? `+${row.supplyApychange}%` : `${row.supplyApychange}%`}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }
    }
)

const MarketTable = connect(null, null)(DecoratedMarketTableClass)

export { MarketTable };