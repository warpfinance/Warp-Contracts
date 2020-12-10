import * as React from "react";

import { Grid, TableCell, TableRow, Typography } from "@material-ui/core";

import { Team, } from "../../util/calculateTeamMetrics";

interface Props {
    team: Team,
}

export const LeaderboardRow: React.FC<Props> = (props: Props) => {

    return (
        <TableRow>
            <TableCell>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <Typography variant="subtitle1">
                            {"1st place"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" color="textSecondary">
                            {props.team.name}
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
                    <Typography variant="subtitle1" color="textSecondary">
                        TVL: 
                    </Typography>
                    <Typography variant="subtitle1">
                        {props.team.tvl}
                    </Typography>
                </Grid>
            </TableCell>
        </TableRow>);
}