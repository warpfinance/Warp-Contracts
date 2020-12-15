import { ethers } from 'ethers';
import moment from 'moment';

import { WarpControlService } from '../lib/contracts/warpControlService';
import { getBlocksOfInterest } from '../lib/logic/blocksOfInterest';
import { gatherDataPoints, ScoreDataHistoryResult } from '../lib/logic/gatherDataPoints';
import { createGetUserTVLConfig } from '../lib/logic/tvlCalculator';
import { getBlockNearTime, getDateString, getLogger, Token } from '../lib/util';
import { getContractAddress, getTokensByNetwork } from '../lib/util/networks';

import * as fs from 'fs';
import { runMethodSafe } from '../lib/util/runner';
import { competitionEndDate, infuraKey, platformOpenDate } from '../config';
import CancellationToken from 'cancellationtoken';
import { exit } from 'process';
import { outputFile } from './output';

const logger = getLogger('scripts::downloadData');

export const downloadData = async (checkpointData?: ScoreDataHistoryResult) => {
  logger.log(`Downloading Data.`);

  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider, networkId } = context;

  const origin = platformOpenDate;
  const end = competitionEndDate;

  const control = new WarpControlService(getContractAddress(networkId, 'warpControl'), provider, null);
  const scTokens = getTokensByNetwork(networkId, false);
  const lpTokens = getTokensByNetwork(networkId, true);

  let usdcToken: Maybe<Token> = null;
  for (const scToken of scTokens) {
    if (scToken.symbol === 'USDC') {
      usdcToken = scToken;
    }
  }
  if (!usdcToken) {
    throw Error('No USDC token found');
  }

  const settingPadding = 20;
  logger.log(
    `Current Settings\n${'Origin Date:'.padEnd(settingPadding)}${moment(origin).format()}\n${'End Date:'.padEnd(
      settingPadding,
    )}${moment(end).format()}`,
  );

  let originBlock: Maybe<ethers.providers.Block> = null;

  logger.debug(`Calculating block numbers from timestamps.`);
  const endBlock = await getBlockNearTime(provider, end);

  if (checkpointData) {
    logger.log(`Checkpoint file is provided, last block was ${checkpointData.lastBlock} and we need to gather data until ${endBlock.number}`);

    if (endBlock.number < checkpointData.lastBlock) {
      logger.warn(`Checkpoint has data past our end so it probably is complete.`);
      return checkpointData;
    }

    originBlock = await provider.getBlock(checkpointData.lastBlock + 1);
  } else {
    originBlock = await getBlockNearTime(provider, origin);
  }

  const numBlocks = endBlock.number - originBlock.number;
  logger.log(
    `Finding blocks of interest between block ${originBlock.number} and ${endBlock.number}. Search area is ${numBlocks} blocks.`,
  );

  const blocksToQuery = await getBlocksOfInterest(control, scTokens, lpTokens, originBlock, endBlock);

  logger.log(`There are ${Object.entries(blocksToQuery).length} blocks to query.`);

  const earlyCancelToken = CancellationToken.create();
  let cancelTries = 0;
  const terminateHandler = () => {
    earlyCancelToken.cancel(`User requested early exit.`);
    logger.warn(`Cancelling... please wait a minute.`);
    ++cancelTries;

    if (cancelTries > 3) {
      logger.error(`Forcing exit`);
      exit();
    }
  }

  logger.log(`Adding early exit handler`);
  process.on('SIGINT', terminateHandler);

  const cachedConfig = await createGetUserTVLConfig(control, scTokens, usdcToken);
  const dataPointResponse = await gatherDataPoints(blocksToQuery, cachedConfig, earlyCancelToken.token);

  logger.log(`Removing early exit handler`);
  process.removeListener('SIGINT', terminateHandler);

  if (dataPointResponse.error) {
    logger.error(`Encountered an error while gathering data:\n${dataPointResponse.error}`);
  }

  if (checkpointData) {
    logger.log(`Merging checkpoint data`);
    dataPointResponse.data = {
      ...dataPointResponse.data,
      ...checkpointData.data
    }
  }

  const fileContents = JSON.stringify(dataPointResponse);
  outputFile(`data`, fileContents);

  return dataPointResponse;
};

const runDownloadData = async () => {
  let dataFile: ScoreDataHistoryResult | undefined;

  if (process.argv.length >= 3) {
    logger.log(`It looks like a checkpoint file was given.`)
    const filePath = process.argv[2];

    console.log(`Loading data from ${filePath}`);

    let fileContents: Maybe<string> = null;

    try {
      fileContents = fs.readFileSync(filePath).toString();
    } catch (e) {
      console.error(`Failed to load ${filePath}\n${e}`);
      return;
    }

    dataFile = JSON.parse(fileContents) as ScoreDataHistoryResult;

    if (dataFile.error) {
      console.warn(`${filePath} indicates an error occurred.`);
    }

  }

  await downloadData(dataFile);
}

if (require.main === module) {
  runMethodSafe(runDownloadData);
}


