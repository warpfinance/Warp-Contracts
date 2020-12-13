import * as React from "react";

import { Card, CardContent, Grid, Table, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";

import { CustomButton } from "../../components";
import { lowercaseFirstLetter } from "../../util/tools";
import moment from "moment";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props {
}

export const LeaderboardCardLeft: React.FC<Props> = (props: Props) => {
    const { timestamp } = useTeamMetrics();
    const nftTime = true;
    const content = nftTime === true ?
        <React.Fragment>
            <Typography variant="subtitle1" >
                You have earned:
            </Typography>
            <TableContainer>
                <Table>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1" color="textSecondary">
                                Social
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1">
                                2 NFTs
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <CustomButton text="Claim" type="short" />
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </React.Fragment>
        :
        <React.Fragment>
            <Typography variant="subtitle1" color="textSecondary">
                TVL
            </Typography>
            <Typography variant="subtitle1">
                Total Value in USD of deposited LP tokens and stablecoin
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                NFT campaign
            </Typography>
            <Typography variant="subtitle1">
                The leaderboard shows the current team TVL.
            </Typography>
            <Typography variant="subtitle1">
                Rewards will be distributed on average TVL to reward early contributors.
            </Typography>
            <Typography variant="subtitle1">
                {`The leaderboard is cached and was last updated ${lowercaseFirstLetter(moment(timestamp).calendar())}.`}
            </Typography>
        </React.Fragment>

    return (
        <Grid
            alignItems="center"
            container
            direction="column"
            item
        >
            <Typography variant="h5">
                {nftTime === true ? "Social NFTs claim" : "Information"}
            </Typography>
            <Card>
                <CardContent>
                    <Grid
                        container
                        direction="column"
                        justify="space-around"
                        alignItems={nftTime === true? "center" :"flex-start"}
                    >
                        {content}
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}
