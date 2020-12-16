import * as React from 'react';

import { Card, CardContent, Grid, makeStyles, Table, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
import { ClaimNftModal, CustomButton, TransactionModal } from '../../components';

import { useLaunchNfts } from '../../hooks/useLaunchNfts';
import { TransactionInfo } from '../../util/types';
import { useConnectedWeb3Context } from '../../hooks/connectedWeb3';
import { WarpLaunchNftService } from '../../services/warpLaunchNft';
import { getContractAddress } from '../../util/networks';

interface Props {}

interface NFTElements {
    name: string;
    text: string;
    type: string;
}

const useStyles = makeStyles(theme => ({
    nftCard: {
        minWidth: '450px'
    }
}))

const nftElementMap: { [type: string]: NFTElements } = {};
const addNftElement = (type: string, name: string, text: string) => {
    nftElementMap[type] = {
        name,
        text,
        type,
    };
};
addNftElement('social', 'Social', '$WARP Reward');
addNftElement('rare', 'Rare', '15% TVL boost');
addNftElement('epic', 'Epic', '75% TVL boost');
addNftElement('legendary', 'Legendary', '150% TVL boost');

export const LeaderboardCardRight: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const launchNfts = useLaunchNfts();
    const context = useConnectedWeb3Context();

    const { library: provider, account, networkId } = context;

    const [transactionSubmitted, setTransactionSubmitted] = React.useState<boolean>(false);
    const [transactionInfo, setTransactionInfo] = React.useState<TransactionInfo>({ hash: '' } as TransactionInfo);
    const [transactionModalOpen, setTransactionModalOpen] = React.useState(false);

    const displayedClaimableNfts = Object.values(nftElementMap).map((e) => {
        return {
            ...e,
            canClaim: launchNfts.claimableNfts.indexOf(e.type) > -1,
        };
    });

    const displayedOwnedNfts = Object.values(nftElementMap)
        .map((e) => {
            return {
                ...e,
                owns: launchNfts.ownedNfts.indexOf(e.type) > -1,
            };
        })
        .filter((e) => {
            return e.owns;
        });

    const [nftModalOpen, setNftModalOpen] = React.useState(false);

    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        setNftModalOpen(false);
    };

    const onClaimClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, type: string) => {
        setNftModalOpen(true);
    };

    const onNftClaim = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setNftModalOpen(false);

        const launchNftControl = new WarpLaunchNftService(
            provider,
            account,
            getContractAddress(networkId, 'launchNftControl'),
        );

        setTransactionModalOpen(true);
        setTransactionSubmitted(false);
        const txInfo = await launchNftControl.claimNfts();

        setTransactionSubmitted(true);
        setTransactionInfo(txInfo);

        await txInfo.finished;

        launchNfts.refresh();
    };

    const handleTransactionModalClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        setTransactionModalOpen(false);
    };

    return (
        <React.Fragment>
            <ClaimNftModal
                handleClose={handleClose}
                nfts={launchNfts.claimableNfts}
                open={nftModalOpen}
                onButtonClick={onNftClaim}
            />
            <Grid alignItems="center" container direction="column" item>
                <Typography variant="h5">NFTs</Typography>
                {launchNfts.claimableNfts.length > 0 ? (
                    <Card className={classes.nftCard}>
                        <CardContent>
                            <Grid container direction="column" justify="space-around" alignItems={'center'}>
                                <React.Fragment>
                                    <Typography variant="subtitle1">You have earned:</Typography>
                                    <TableContainer>
                                        <Table>
                                            {displayedClaimableNfts.map((nft) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                {nft.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle1">{nft.text}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CustomButton
                                                                onClick={(
                                                                    event: React.MouseEvent<
                                                                        HTMLAnchorElement,
                                                                        MouseEvent
                                                                    >,
                                                                ) => onClaimClick(event, nft.type)}
                                                                disabled={!nft.canClaim}
                                                                text="Claim"
                                                                type="short"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </Table>
                                    </TableContainer>
                                </React.Fragment>
                            </Grid>
                        </CardContent>
                    </Card>
                ) : null}
                <Card className={classes.nftCard}>
                    <CardContent>
                        <Grid container direction="column" justify="space-around" alignItems={'center'}>
                            <React.Fragment>
                                <Typography variant="h6">Your NFT's</Typography>
                                <TableContainer>
                                    <Table>
                                        {displayedOwnedNfts.map((nft) => {
                                            return (
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1" color="textSecondary">
                                                            {nft.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">{nft.text}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </Table>
                                </TableContainer>
                                {displayedOwnedNfts.length == 0 ? (
                                    <Typography variant="subtitle1" color="textSecondary">
                                        You have no Warp NFT's
                                    </Typography>
                                ) : null}
                            </React.Fragment>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <TransactionModal
                action={'Transaction'}
                handleClose={handleTransactionModalClose}
                open={transactionModalOpen}
                confirmed={transactionSubmitted}
                txHash={transactionInfo.hash}
            />
        </React.Fragment>
    );
};

// :
// <React.Fragment>
//     <Typography variant="subtitle1" color="textSecondary">
//         Top 1–3 Teams
// </Typography>
//     <Typography variant="subtitle1">
//         Legendary 150% booster
// </Typography>
//     <Typography variant="subtitle1" color="textSecondary">
//         Top 4–10 Teams
// </Typography>
//     <Typography variant="subtitle1">
//         Epic 75% booster
// </Typography>
//     <Typography variant="subtitle1" color="textSecondary">
//         Remaining Participating Teams
// </Typography>
//     <Typography variant="subtitle1">
//         Rare 15% booster
// </Typography>
// </React.Fragment>
// }
