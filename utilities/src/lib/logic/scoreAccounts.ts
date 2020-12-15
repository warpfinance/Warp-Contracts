
import BigNumber from 'bignumber.js';
import { competitionStartDate } from '../../config';
import { getLogger } from '../util';
import { AccountScoreData } from './dataHelpers';
import { AccountScoreDataPoint } from './gatherDataPoints';
import { UserTVL } from './tvl';

export interface AccountScore {
  totalScore: string;
  weightedScore: number;
}

export interface AccountScores {
  [account: string]: AccountScore
}

interface ScoringDataPoint extends AccountScoreDataPoint {
  blockNumber: number;
}

const logger = getLogger('Logic::scoreAccounts');

export const calculateAccountScores = (accountScoreData: AccountScoreData, competitionStartBlock: number, competitionEndBlock: number) => {
  const accountScores: AccountScores = {};

  if (competitionEndBlock < competitionStartBlock) {
    throw Error(`Competition end block is less than the start block! ${competitionEndBlock} < ${competitionStartBlock}`)
  }

  const numberOfBlocksInCompetition = competitionEndBlock - competitionStartBlock;

  for (const [account, dataPoints] of Object.entries(accountScoreData)) {
    let scoreAccumulator = new BigNumber(0);

    const numDataPoints = Object.keys(dataPoints).length;
    const sortedDataPointKeys = Object.keys(dataPoints).map(e => parseInt(e)).sort();


    let lastDataPoint: Maybe<ScoringDataPoint> = null;
    for (let i = 0; i < numDataPoints; ++i) {
      const blockNumber = sortedDataPointKeys[i];
      const dataPoint = dataPoints[blockNumber];

      if (blockNumber < competitionStartDate) {
        /*
          Data point before the start of the competition
          This doesn't count add score
        */
        logger.debug(`Found data point before the competition for ${account} at block ${blockNumber}`);
      } else if (blockNumber >= competitionEndBlock) {
        /*
          Data point after the end of the competition
          We should calculate score up until the end if there is any
        */

        if (lastDataPoint && lastDataPoint.blockNumber < competitionEndBlock) {
          logger.debug(`Found data point after the competition for ${account} at block ${blockNumber}`);
          const blocksBeforeEnd = competitionEndBlock - lastDataPoint.blockNumber;
          const lastTVL = lastDataPoint.tvl.tvl;
          const score = lastTVL * blocksBeforeEnd;
          scoreAccumulator = scoreAccumulator.plus(score);
        }
      } else {
        /* Data point happened during the competition */
        logger.debug(`Found data point during the competition for ${account} at block ${blockNumber}`);

        // We have a previous point so we need to accumulate score
        if (lastDataPoint) {
          // We don't want to give score before the start of the competition
          const lastBlock = Math.max(lastDataPoint.blockNumber, competitionStartBlock);

          // Calculate score since last data point's block
          const blocksSinceLastPoint = blockNumber - lastBlock;
          const lastTVL = lastDataPoint.tvl.tvl;
          const score = lastTVL * blocksSinceLastPoint;
          scoreAccumulator = scoreAccumulator.plus(score);
        }
      }

      // Store the last data point
      lastDataPoint = {
        blockNumber,
        ...dataPoint
      }
    }

    if (!lastDataPoint) {
      logger.warn(`No data point were found for ${account} which could mean data corruption`);
    }

    // Need to accumulate the score until the end of the competition
    // It's possible that we have points after the the competition so we'll ignore those
    if (lastDataPoint && lastDataPoint.blockNumber < competitionEndBlock) {
      logger.debug(`Cleanup for ${account} last block was at ${lastDataPoint.blockNumber}`)

      // We don't want to give score before the start of the competition
      const lastBlock = Math.max(lastDataPoint.blockNumber, competitionStartBlock);

      const blocksBeforeEnd = competitionEndBlock - lastBlock;
      const lastTVL = lastDataPoint.tvl.tvl;
      const score = lastTVL * blocksBeforeEnd;
      scoreAccumulator = scoreAccumulator.plus(score);
    }

    const weightedScore = scoreAccumulator.div(numberOfBlocksInCompetition).toNumber();

    accountScores[account] = {
      totalScore: scoreAccumulator.toString(),
      weightedScore
    }
  }

  return accountScores;

}