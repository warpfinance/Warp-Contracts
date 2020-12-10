import * as React from "react";

import { BorrowerMarketCard, CustomButton, LenderMarketCard, MarketTable } from "../components";

import { Grid, Typography } from "@material-ui/core";
import { Header } from "../components";
import { useWeb3React } from "@web3-react/core";
import { getLogger } from "../util/logger";
import { calculateTeamMetrics } from "../util/calculateTeamMetrics";
import connectors from "../util/connectors";

interface Props { }

const logger = getLogger('Pages::CalculateMetrics');


export const CalculateMetrics: React.FC<Props> = (props: Props) => {
    const context = useWeb3React();

    const [isConnected, setIsConnected] = React.useState(false);
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [isDone, setIsDone] = React.useState(false);

    const tryConnectToMetaMask = async () => {
        try {
            await context.activate(connectors.MetaMask);
            setIsConnected(true);
        } catch (e) {
            console.error(`Failed to connect: ${e}`);
        }
    }
    
    React.useEffect(() => {
        const alreadyCalculating = isCalculating;

        const calculate = async () => {
            if (!isConnected) {
                logger.log(`Not connected to metamask yet`);
                return;
            }
            if (!context.chainId || !context.library) {
                logger.log("not ready to calculate team metrics");
                setIsCalculating(false);
                return;
              }

            const networkId = context.chainId;
            const provider = context.library;

            if (alreadyCalculating) {
                logger.log(`Cancelled calculating. already doing it....`)
                return;
            }
            logger.log("Calculating team metrics");
            setIsCalculating(true);

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

            setIsDone(true);
        }

        calculate();
    }, [context.library, context.chainId, isConnected])

    return (
        <React.Fragment>
            {
                isDone ? 
                <Typography>
                    Calculating finished, your browser should have downloaded a file.
                </Typography>
                    : isCalculating ?
                    <Typography>
                    Generating the leaderboard... hang tight this might take awhile. You can press F12 to open the console and watch the matrix.
                    </Typography> :
                    <CustomButton 
                        text={"Click to connect Metamask and start"}
                        type={"long"}
                        onClick={tryConnectToMetaMask}
                    />
            }
            
        </React.Fragment>
    )
}