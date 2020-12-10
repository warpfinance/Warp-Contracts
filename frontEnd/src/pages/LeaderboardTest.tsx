import * as React from "react";

import { BorrowerMarketCard, LenderMarketCard, MarketTable } from "../components";

import { Grid, Typography } from "@material-ui/core";
import { Header } from "../components";
import { useTeamMetrics } from "../hooks/useTeamMetrics";

interface Props { }

export const LeadboardTest: React.FC<Props> = (props: Props) => {

    const metrics = useTeamMetrics();

    return (
        <React.Fragment>
            <Typography>
                Hey man
            </Typography>
        </React.Fragment>
    )
}