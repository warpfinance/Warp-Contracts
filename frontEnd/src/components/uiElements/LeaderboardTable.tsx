import * as React from "react";

import { Grid, Table, TableBody, TableContainer } from "@material-ui/core";

import { LeaderboardRow } from "../../components/uiElements/LeaderboardRow";
import { RefreshToken } from "../../hooks/useRefreshToken";
import { Team, } from "../../util/calculateTeamMetrics";

interface Props {
    teams: Team[],
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
                        {props.teams.map((team: Team, index: number) => {
                            return (
                                <LeaderboardRow
                                    rank={index}
                                    team={team}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}