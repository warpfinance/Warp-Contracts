import * as React from "react";

import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { MigrateTableRow } from "../../components";
import { Token } from "../../util/token";
import { MigrationVault } from "../../hooks/useMigrations";


const useStyles = makeStyles(theme => ({
    migrationTable: {
        width: "720px"
    },
    cell1: {
        width: "220px"
    },
    cell2: {
        width: "150px"
    },
    cell3: {
        width: "350px"
    }
}));

interface Props {
    onMigrateClick: (vault: MigrationVault) => void,
    onWithdrawClick: (vault: MigrationVault) => void,
    type: "lending" | "borrowing"
    vaults: MigrationVault[]
}

export const MigrateTable: React.FC<Props> = (props: Props) => {
    const liquidityOrCollateral = props.type === "borrowing" ? "LP Tokens" : "Stable Coins";
    const classes = useStyles();

    return (
        <TableContainer
            className={classes.migrationTable}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.cell1}>
                            <Typography variant="subtitle1" color="textSecondary">
                                {liquidityOrCollateral}
                            </Typography>
                        </TableCell>
                        <TableCell className={classes.cell2}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Vault
                            </Typography>
                        </TableCell>
                        <TableCell className={classes.cell3} align="center">
                            <Typography variant="subtitle1" color="textSecondary">
                                
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.vaults.map((vault: MigrationVault) => (
                        <MigrateTableRow
                            onMigrateClick={props.onMigrateClick}
                            onWithdrawClick={props.onWithdrawClick}
                            vault={vault}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}