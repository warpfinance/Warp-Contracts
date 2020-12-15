import { logger } from 'ethers';
import { AccountScoreDataPoint, ScoreDataHistory } from './gatherDataPoints';

export interface AccountDataPoints {
    [blockNumber: number]: AccountScoreDataPoint;
}

export interface AccountScoreData {
    [account: string]: AccountDataPoints;
}

const insertAccountData = (
    accountScores: AccountScoreData,
    blockNumber: number,
    account: string,
    data: AccountScoreDataPoint,
) => {
    let accountData = accountScores[account];
    if (!accountData) {
        accountScores[account] = {};
        accountData = accountScores[account];
    }

    if (accountData[blockNumber]) {
        logger.warn(`Found duplicate data points for ${account} at block ${blockNumber}`);
    }

    accountData[blockNumber] = data;
};

export const convertScoreDataToPerAccount = (scoreData: ScoreDataHistory) => {
    // Get a sorted list of all the block numbers we have data from
    const blocks = Object.keys(scoreData)
        .map((e) => parseInt(e))
        .sort();
    const accountScores: AccountScoreData = {};

    for (const blockNumber of blocks) {
        const scoreDataPoint = scoreData[blockNumber].data;

        for (const [account, data] of Object.entries(scoreDataPoint)) {
            insertAccountData(accountScores, blockNumber, account, data);
        }
    }

    return accountScores;
};

export const calculateNumberOfDataPoints = (scoreData: ScoreDataHistory) => {
    // Get a sorted list of all the block numbers we have data from
    const blocks = Object.keys(scoreData)
        .map((e) => parseInt(e))
        .sort();

    let numDataPoints = 0;
    for (const blockNumber of blocks) {
        const scoreDataPoint = scoreData[blockNumber].data;

        for (const _ of Object.keys(scoreDataPoint)) {
            numDataPoints++;
        }
    }

    return numDataPoints;
};
