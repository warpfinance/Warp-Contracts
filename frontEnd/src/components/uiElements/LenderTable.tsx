import * as React from "react";

import { Amount, CustomButton } from "../../components"
import { Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { WithStyles, createStyles, withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";

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

const styles = (theme: any) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
    onButtonClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    type: "lend" | "withdraw"
}

interface State {
    amountCurrency: string,
    amountValue: number,
    focusedAmountId: string | undefined,
}

const DecoratedLenderTableClass = withStyles(styles)(
    class LenderTableClass extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                amountCurrency: "",
                amountValue: 0,
                focusedAmountId: undefined
            };
            this.onBlur.bind(this)
            this.onChange.bind(this)
            this.onFocus.bind(this)
        }

        onBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            if (this.state.amountValue === 0) {
                this.setState({ focusedAmountId: undefined });
            }
        };

        onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            // TO-DO: Input validation
            this.setState({
                amountCurrency: event.target.id,
                amountValue: Number(event.target.value),
                focusedAmountId: event.target.id
            });
        };

        onFocus = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            if (event !== null && event !== undefined && this.state.focusedAmountId !== event.target.id) {
                this.setState({ focusedAmountId: event.target.id });
            }
        };

        render() {
            const data = this.props.type === "withdraw" ? withdrawData : lendData;
            const lendOrWithdraw = this.props.type === "withdraw" ? "withdraw" : "lend";

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
                                            {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} assets
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
                                                    focusedAmountId={this.state.focusedAmountId}
                                                    onBlur={this.onBlur}
                                                    onChange={this.onChange}
                                                    onFocus={this.onFocus} />
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CustomButton
                        disabled={this.state.amountValue === 0}
                        onClick={this.props.onButtonClick}
                        text={lendOrWithdraw.charAt(0).toUpperCase() + lendOrWithdraw.slice(1)}
                        type="long" />
                </Grid>
            );
        }
    }
)

const LenderTable = connect(null, null)(DecoratedLenderTableClass)

export { LenderTable };