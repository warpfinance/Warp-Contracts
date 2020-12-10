import * as React from "react";

import { Grid, Table, TableBody, TableContainer } from "@material-ui/core";

import { LeaderboardRow } from "../../components/uiElements/LeaderboardRow";
import { RefreshToken } from "../../hooks/useRefreshToken";
import { Team } from "../../util/teams";

interface Props {
    teams: Team[],
    refreshToken: RefreshToken
}

export const LeaderboardTable: React.FC<Props> = (props: Props) => {
    return (
        <Grid
            container
            direction="column"
            alignItems="stretch"
        >
            <TableContainer>
                <Table>
                    <TableBody>
                        {props.teams.map((team: Team) => {
                            return (
                                <LeaderboardRow
                                    team={team}
                                    refreshToken={props.refreshToken}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}