import * as React from "react";

import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { CustomButton } from "../../components";
import { connect } from "react-redux";

//@ts-ignore
function createData(icon, name, supplyShare, wallet, walletCurrency) {
    return { icon, name, supplyShare, wallet, walletCurrency, };
}

const lenderData = [
    createData(<Avatar alt={'dai.png'} src={'dai.png'} />, 'Dai', 3.40, 125, 'DAI'),
    createData(<Avatar alt={'usdt.png'} src={'usdt.png'} />, 'Tether', 3.40, 125, 'DAI'),
    createData(<Avatar alt={'usd.png'} src={'usd.png'} />, 'USD Coin', 3.40, 125, 'DAI'),
];

const borrowData = [
    createData(<AvatarGroup max={2}><Avatar alt={'eth.png'} src={'eth.png'} />
        <Avatar alt={'dai.png'} src={'dai.png'} /></AvatarGroup>,
        'ETH - DAI', 1.97, 100, 'USD'),
    createData(<AvatarGroup><Avatar alt={'eth.png'} src={'eth.png'} />
        <Avatar alt={'usdt.png'} src={'usdt.png'} /></AvatarGroup>,
        'ETH - USDT', 3.25, 100, 'USD'),
    createData(<AvatarGroup><Avatar alt={'wbtc.png'} src={'wbtc.png'} />
        <Avatar alt={'weth.png'} src={'weth.png'} /></AvatarGroup>,
        'wBTC - wETH', 1.32, 100, 'USD'),
    createData(<AvatarGroup><Avatar alt={'usdt.png'} src={'usdt.png'} />
        <Avatar alt={'weth.png'} src={'weth.png'} /></AvatarGroup>,
        'USDT - wETH', 2.18, 100, 'USD'),
];

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    type: "lending" | "borrowing"
}

const DecoratedDashboardTableClass = withStyles(styles)(
    class DashboardTableClass extends React.Component<Props, {}> {
        render() {
            const buttonHref = this.props.type === "borrowing" ? "/borrower" : "/lender";
            const buttonText = this.props.type === "borrowing" ? "Borrow" : "Lend";
            const data = this.props.type === "borrowing" ? borrowData : lenderData;
            const liquidityOrCollateral = this.props.type === "borrowing" ? "Collateral" : "Liquidity";

            return (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} assets
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Wallet
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {liquidityOrCollateral}
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
                                                        {row.supplyShare.toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%"}
                                                    </Typography>
                                                </Grid>
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
                                            <Grid item>
                                                <Typography variant="subtitle1">
                                                    {row.wallet.toLocaleString() + " " + row.walletCurrency}
                                                </Typography>
                                            </Grid>
                                            {this.props.type === "borrowing" ?
                                                <Grid item>
                                                    <Typography color="textSecondary">
                                                        Uni - LP - v2
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
                                            alignItems="center"
                                        >
                                            <CustomButton href={buttonHref} text={buttonText} type={"short"} />
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

const DashboardTable = connect(null, null)(DecoratedDashboardTableClass)

export { DashboardTable };