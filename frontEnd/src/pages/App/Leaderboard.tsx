import * as React from "react";

import { Typography } from "@material-ui/core";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props { }

export const Leadboard: React.FC<Props> = (props: Props) => {

    const metrics = useTeamMetrics();

    return (
        <React.Fragment>
            <Typography>
                Hey man
            </Typography>
        </React.Fragment>
    )
}