import * as React from "react";

import { Card, CardContent, Grid, Table, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { ClaimNftModal, CustomButton } from "../../components";

import { NftTimeContext } from "../../hooks/nftTime";
import { lowercaseFirstLetter } from "../../util/tools";
import moment from "moment";
import { useTeamMetrics } from "../../hooks/useTeamMetrics";

interface Props {
}

export const LeaderboardCardLeft: React.FC<Props> = (props: Props) => {
    const { timestamp } = useTeamMetrics();

    const nftAmounts = {
        "rare": 14,
        "social": 2,
        "legendary": 14,
        "epic": 14,
    };
    const [nftModalOpen, setNftModalOpen] = React.useState(false);

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setNftModalOpen(false);
    }

    const onNftClaim = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Web3 Integration
        setNftModalOpen(false);
    }

    return (
        <React.Fragment>
            <ClaimNftModal
                amount={nftAmounts.social}
                handleClose={handleClose}
                open={nftModalOpen}
                onButtonClick={onNftClaim}
                type={"social"} />
            <NftTimeContext.Consumer>
                {({ nftTime }) => (
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
                                    alignItems={nftTime === true ? "center" : "flex-start"}
                                >
                                    {nftTime === true ?
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
                                                                {nftAmounts.social} NFTs
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomButton onClick={() => setNftModalOpen(true)} text="Claim" type="short" />
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
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </NftTimeContext.Consumer>
        </React.Fragment>
    )
}
