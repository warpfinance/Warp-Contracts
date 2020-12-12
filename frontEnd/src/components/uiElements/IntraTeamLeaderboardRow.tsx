import * as React from "react";

import { Grid, TableCell, TableRow, Typography } from "@material-ui/core";

import { Team, } from "../../util/calculateTeamMetrics";
import { useWeb3React } from "@web3-react/core";

interface Props {
    rank: number,
    team: Team,
}

export const IntraTeamLeaderboardRow: React.FC<Props> = (props: Props) => {
    const context = useWeb3React();
    const place = props.rank + 1 === 1 || (props.rank >= 20 && (props.rank + 1) % 10 === 1) ? "st" :
        props.rank + 1 === 2 || (props.rank >= 20 && (props.rank + 1) % 10 === 2) ? "nd" :
            props.rank + 1 === 3 || (props.rank >= 20 && (props.rank + 1) % 10 === 3) ? "rd" :
                "th";

    const userTvl = props.team.members.find((member) => member.address === context.account)?.tvl;

    return (
        <TableRow key={props.team.code}>
            <TableCell>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <Typography variant="subtitle1" color="textSecondary">
                            {(props.rank + 1) + `${place} place`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">
                            {props.team.name}
                        </Typography>
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                {userTvl !== undefined ?
                    <Typography variant="subtitle1">
                        {"$" + Number(userTvl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    :
                    null
                }
            </TableCell>
            <TableCell>
                <Typography variant="subtitle1">
                    {"$" + Number(props.team.tvl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
            </TableCell>
        </TableRow>
    );
}