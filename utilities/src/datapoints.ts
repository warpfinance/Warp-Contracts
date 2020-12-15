import { ethers } from 'ethers';
import moment from 'moment';

import { WarpControlService } from './lib/contracts/warpControlService';
import { getBlocksOfInterest } from './lib/logic/blocksOfInterest';
import { gatherDataPoints } from './lib/logic/gatherDataPoints';
import { createGetUserTVLConfig } from './lib/logic/tvlCalculator';
import { getBlockNearTime, getDateString, getLogger, Token } from './lib/util';
import { getContractAddress, getTokensByNetwork } from './lib/util/networks';

import * as fs from 'fs';
import { runMethodSafe } from './lib/util/runner';
import { competitionEndDate, infuraKey, platformOpenDate } from './config';

require('dotenv').config();

const logger = getLogger('datapoints');

const origin = platformOpenDate;
const end = competitionEndDate;

export interface TeamMember {
  address: string;
  tvl: string;
  lp: string;
  sc: string;
}

export interface Team {
  name: string;
  code: string;
  tvl: string;
  lp: string;
  sc: string;
  numMembers: number;
  members: TeamMember[];
}

const pullData = async () => {
  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider, networkId } = context;

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

  const originBlock = await getBlockNearTime(provider, origin);
  const endBlock = await getBlockNearTime(provider, end);

  const numBlocks = endBlock.number - originBlock.number;
  logger.log(
    `Finding blocks of interest between block ${originBlock.number} and ${endBlock.number}. Search area is ${numBlocks} blocks.`,
  );

  const blocksToQuery = await getBlocksOfInterest(control, scTokens, lpTokens, originBlock, endBlock);

  logger.log(`There are ${Object.entries(blocksToQuery).length} blocks to query.`);

  const cachedConfig = await createGetUserTVLConfig(control, scTokens, usdcToken);
  const dataPointResponse = await gatherDataPoints(blocksToQuery, cachedConfig);

  if (dataPointResponse.error) {
    logger.error(`Encountered an error while gathering data:\n${dataPointResponse.error}`);
  }

  const timestamp = getDateString();
  const filename = `data_${timestamp}.json`;
  logger.log(`Saving data as ${filename} on disk`);

  const fileContents = JSON.stringify(dataPointResponse);
  fs.writeFileSync(filename, fileContents);
};

runMethodSafe(pullData);
