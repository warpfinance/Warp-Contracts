import { getLogger, setTransactionCallBlockNumber } from '../util';
import { BlocksOfInterest } from './blocksOfInterest';
import { getUserTVL, GetUserTVLConfig, UserTVL } from './tvl';

export interface AccountScoreDataPoint {
    tvl: UserTVL;
}

export interface ScoreDataPoint {
    [account: string]: AccountScoreDataPoint;
}

export interface ScoreDataHistory {
    [blockNumber: number]: {
        data: ScoreDataPoint;
    };
}

export interface ScoreDataHistoryResult {
    error: any;
    data: ScoreDataHistory;
    lastBlock: number;
}

const logger = getLogger('Logic::gatherDataPoints');

export const gatherDataPoints = async (
    blocksToQuery: BlocksOfInterest,
    cachedConfig: GetUserTVLConfig,
): Promise<ScoreDataHistoryResult> => {
    const dataPoints: ScoreDataHistory = {};

    const queryBlocks = Object.keys(blocksToQuery)
        .map((v) => parseInt(v))
        .sort();

    let lastBlock = 0;
    try {
        for (const blockNumber of queryBlocks) {
            logger.log(`Getting data from block number ${blockNumber}`);
            setTransactionCallBlockNumber(blockNumber);

            const blockDataPoints: ScoreDataPoint = {};
            const blockParticipants = blocksToQuery[blockNumber].accounts;
            logger.log(`${blockParticipants.length} accounts to get data from`);

            for (const account of blockParticipants) {
                const userTVLAtBlock = await getUserTVL(account, cachedConfig);
                logger.debug(`Calculated ${account} TVL as ${userTVLAtBlock.tvl.toFixed(0)} at block ${blockNumber}`);

                blockDataPoints[account] = {
                    tvl: userTVLAtBlock,
                };
            }

            dataPoints[blockNumber] = {
                data: blockDataPoints,
            };
            lastBlock = blockNumber;
        }
    } catch (e) {
        return {
            error: e,
            data: dataPoints,
            lastBlock
        };
    }

    return {
        error: undefined,
        data: dataPoints,
        lastBlock
    };
};
