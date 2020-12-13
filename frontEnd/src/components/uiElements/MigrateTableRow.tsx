import { Avatar, Grid, TableCell, TableRow, Typography } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import { BigNumber } from "ethers";
import { BorrowerCountdownContext } from "../../hooks/borrowerCountdown";
import { CustomButton } from "..";
import React from "react";
import { Token } from "../../util/token";
import { formatBigNumber, parseBigNumber } from "../../util/tools";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useTokenInterest } from "../../hooks/useTokenInterest";
import { useWarpControl } from "../../hooks/useWarpControl";
import { MigrationVault } from "../../hooks/useMigrations";

interface Props {
    onMigrateClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    onWithdrawClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    vault: MigrationVault
}

export const MigrateTableRow: React.FC<Props> = (props: Props) => {
    
    const displayedVaultBalance = props.vault.value.toLocaleString(undefined, {maximumFractionDigits: 2});

    let icon: any;
    if (!props.vault.token.isLP) {
        icon = <Avatar alt={props.vault.token.image} src={props.vault.token.image} />;
    } else {
        icon = <AvatarGroup max={2}>
            <Avatar alt={props.vault.token.image} src={props.vault.token.image} />;
      <Avatar alt={props.vault.token.image2} src={props.vault.token.image2} />;
    </AvatarGroup>
    }

    return (
        <TableRow>
            <TableCell>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >

                    {icon}
                    <Grid
                        item
                        direction="column"
                    >
                        <Grid item>
                            <Typography variant="subtitle1">
                                {props.vault.token.symbol}
                            </Typography>
                        </Grid>
                        {/* {
                            (props.type === "lending") ? (
                                <Grid item>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {tokenSupplyRate.toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%"}
                                    </Typography>
                                </Grid>
                            ) : null
                        } */}
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
                    <Grid item>
                        <Typography variant="subtitle1">
                            {"$" + displayedVaultBalance}
                        </Typography>
                    </Grid>
                    <Grid item>
                            <Typography color="textSecondary">
                                {"in USDC"}
                            </Typography>
                        </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item>
                        <CustomButton
                            onClick={props.onWithdrawClick}
                            text={"Withdraw"}
                            type={"short"} />
                    </Grid>
                    <Grid item>
                        <CustomButton
                            onClick={props.onMigrateClick}
                            text={"Migrate"}
                            type={"short"} />
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    )
}