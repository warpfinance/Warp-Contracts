import * as React from "react";

import { BorrowerMarketCard, LenderMarketCard, MarketTable } from "../components";

import { Grid, Typography } from "@material-ui/core";
import { Header } from "../components";
import { useWeb3React } from "@web3-react/core";
import { getLogger } from "../util/logger";
import { useTeamMetrics } from "../hooks/useTeamMetrics";

interface Props { }

const logger = getLogger('Pages::TestCache');


export const TestCache: React.FC<Props> = (props: Props) => {
    const context = useWeb3React();
    const {teams, firstLoad, refresh } = useTeamMetrics();

    return (
        <React.Fragment>
            <Typography>
                Testing cache
            </Typography>
        </React.Fragment>
    )
}