import * as React from "react";

import { BorrowerMarketCard, LenderMarketCard, MarketTable } from "../components";

import { Grid, Typography } from "@material-ui/core";
import { Header } from "../components";
import { useWeb3React } from "@web3-react/core";
import { getLogger } from "../util/logger";
import { calculateTeamMetrics } from "../util/calculateTeamMetrics";

interface Props { }

const logger = getLogger('Pages::CalculateMetrics');


export const CalculateMetrics: React.FC<Props> = (props: Props) => {
    const context = useWeb3React();

    const [isCalculating, setIsCalculating] = React.useState(false);
    
    React.useEffect(() => {
        const alreadyCalculating = isCalculating;
        setIsCalculating(true);

        const calculate = async () => {
            if (!context.chainId || !context.library) {
                logger.log("not ready to calculate team metrics");
                setIsCalculating(false);
                return;
              }

            const networkId = context.chainId;
            const provider = context.library;

            if (!alreadyCalculating) {
                logger.log(`Cancelled calculating. already doing it....`)
                return;
            }
            logger.log("Calculating team metrics");
            

            const calculatedTeams = await calculateTeamMetrics(provider, networkId);

            const teamJson = JSON.stringify(calculatedTeams);
            const data = "text/json;charset=utf-8," + encodeURIComponent(teamJson);

            const url = `data:${data}`
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'teams.json');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        }

        calculate();
    }, [context.library, context.chainId])

    return (
        <React.Fragment>
            <Typography>
                Generating the leaderboard... hang tight this might take awhile. You can press F12 to open the console and watch the matrix.
            </Typography>
        </React.Fragment>
    )
}