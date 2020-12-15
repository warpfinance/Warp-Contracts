import { getBlockNearTime, getDateString, getLogger } from './lib/util';
import { runMethodSafe } from './lib/util/runner';
import * as fs from 'fs';
import { ScoreDataHistoryResult } from './lib/logic/gatherDataPoints';
import { calculateNumberOfDataPoints, convertScoreDataToPerAccount } from './lib/logic/dataHelpers';
import { competitionEndDate, competitionStartDate, infuraKey } from './config';
import { ethers } from 'ethers';
import { calculateAccountScores } from './lib/logic/scoreAccounts';

require('dotenv').config();

const logger = getLogger('score_accounts');

const scoring = async () => {
  if (process.argv.length < 3) {
    logger.error(`a 'filepath' parameter is required. Pass in the name of the data json file in the cli`);
    return;
  }
  const filePath = process.argv[2];

  console.log(`Loading data from ${filePath}`);

  let fileContents: Maybe<string> = null;

  try {
    fileContents = fs.readFileSync(filePath).toString();
  } catch (e) {
    console.error(`Failed to load ${filePath}\n${e}`);
    return;
  }

  const dataFile = JSON.parse(fileContents) as ScoreDataHistoryResult;

  if (dataFile.error) {
    console.warn(`${filePath} indicates an error occurred. An inaccurate result is likely.`);
  }

  logger.log(`Data file is ${fileContents.length} characters long.`);

  logger.info(`There is data from ${Object.keys(dataFile.data).length} different blocks.`);

  const dataByAccount = convertScoreDataToPerAccount(dataFile.data);

  logger.info(`There are ${Object.keys(dataByAccount).length} accounts to score.`);

  logger.log(`There are ${calculateNumberOfDataPoints(dataFile.data)} data points to process.`);

  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider } = context;
  const competitionStartBlock = await getBlockNearTime(provider, competitionStartDate);
  const competitionEndBlock = await getBlockNearTime(provider, competitionEndDate);

  const accountScores = calculateAccountScores(dataByAccount, competitionStartBlock.number, competitionEndBlock.number);

  const timestamp = getDateString();
  const filename = `account_scores_${timestamp}.json`;
  logger.log(`Saving data as ${filename} on disk`);

  const toWriteContents = JSON.stringify(accountScores);
  fs.writeFileSync(filename, toWriteContents);
};

runMethodSafe(scoring);
