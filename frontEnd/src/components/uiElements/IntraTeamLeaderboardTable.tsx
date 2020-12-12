import * as React from "react";

import { Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { IntraTeamLeaderboardRow, TablePaginationActions } from "../../components";

import { TeamMember, } from "../../util/calculateTeamMetrics";

interface Props {
    members: TeamMember[],
}

export const IntraTeamLeaderboardTable: React.FC<Props> = (props: Props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.members.length - page * rowsPerPage);

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                                    Rank
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    TVL
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? props.members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.members
                        ).map((member: TeamMember, index: number) => {
                            return (
                                <IntraTeamLeaderboardRow
                                    member={member}
                                    rank={index + rowsPerPage * page}
                                />
                            )
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 110 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TablePagination
                            component={TableRow}
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            count={props.members.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            //@ts-ignore
                            ActionsComponent={TablePaginationActions}
                            style={{ width: 600 }}
                        />
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    );
}