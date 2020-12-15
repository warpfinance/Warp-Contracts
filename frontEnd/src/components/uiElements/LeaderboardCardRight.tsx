import * as React from "react";

import { Card, CardContent, Grid, Table, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { ClaimNftModal, CustomButton } from "../../components";

import { NftTimeContext } from "../../hooks/nftTime";

interface Props {
}

export const LeaderboardCardRight: React.FC<Props> = (props: Props) => {
    // TO-DO: Web3 Integration
    const nftAmounts = {
        "rare": 14,
        "social": 2,
        "legendary": 14,
        "epic": 14,
    };
    const [nftModalOpen, setNftModalOpen] = React.useState(false);
    const [nftType, setNftType] = React.useState<"rare" | "social" | "legendary" | "epic">("rare");

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setNftModalOpen(false);
    }

    const onClaimClick =
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
            type: "rare" | "social" | "legendary" | "epic") => {
            setNftType(type);
            setNftModalOpen(true);
        }

    const onNftClaim = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Web3 Integration
        setNftModalOpen(false);
    }

    return (
        <React.Fragment>
            <ClaimNftModal
                amount={nftAmounts[nftType]}
                handleClose={handleClose}
                open={nftModalOpen}
                onButtonClick={onNftClaim}
                type={nftType} />
            <NftTimeContext.Consumer>
                {({ nftTime }) => (
                    <Grid
                        alignItems="center"
                        container
                        direction="column"
                        item
                    >
                        <Typography variant="h5">
                            NFTs claim
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
                                                                Legendary
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">
                                                                150% Boost
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomButton
                                                                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onClaimClick(event, "legendary")}
                                                                text="Claim"
                                                                type="short" />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                Epic
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">
                                                                75% Boost
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomButton
                                                                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onClaimClick(event, "epic")}
                                                                text="Claim"
                                                                type="short" />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                Rare
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">
                                                                15% Boost
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomButton
                                                                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onClaimClick(event, "rare")}
                                                                text="Claim"
                                                                type="short" />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                Social
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">
                                                                15% Boost
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
                                                Top 1–3 Teams
                                        </Typography>
                                            <Typography variant="subtitle1">
                                                Legendary 150% booster
                                        </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Top 4–10 Teams
                                        </Typography>
                                            <Typography variant="subtitle1">
                                                Epic 75% booster
                                        </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Remaining Participating Teams
                                        </Typography>
                                            <Typography variant="subtitle1">
                                                Rare 15% booster
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
