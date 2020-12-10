import * as React from "react";

import { BorrowerMarketCard, LenderMarketCard, MarketTable } from "../components";

import { Grid, Typography } from "@material-ui/core";
import { Header } from "../components";
import { useWeb3React } from "@web3-react/core";
import { getLogger } from "../util/logger";
import { useTeamMetrics } from "../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::Leaderboard');

export const Leaderboard: React.FC<Props> = (props: Props) => {
    const {teams, firstLoad, refresh } = useTeamMetrics();



    return (
        <React.Fragment>
            <Typography>
                Leaderboard
            </Typography>
            {JSON.stringify(teams, undefined, 4)}
        </React.Fragment>
    )
}