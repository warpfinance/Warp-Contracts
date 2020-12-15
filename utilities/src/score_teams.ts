import { getBlockNearTime, getContractAddress, getLogger } from './lib/util';
import { runMethodSafe } from './lib/util/runner';
import * as fs from 'fs';
import { competitionEndDate, competitionStartDate, infuraKey } from './config';
import { ethers } from 'ethers';
import { AccountScores } from './lib/logic/scoreAccounts';
import { WarpControlService } from './lib/contracts';

require('dotenv').config();

const logger = getLogger('score_teams');

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

  const dataFile = JSON.parse(fileContents) as AccountScores;

  if (dataFile.error) {
    console.warn(`${filePath} indicates an error occurred. An inaccurate result is likely.`);
  }

  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider, networkId } = context;
  const competitionStartBlock = await getBlockNearTime(provider, competitionStartDate);
  const competitionEndBlock = await getBlockNearTime(provider, competitionEndDate);

  const control = new WarpControlService(getContractAddress(networkId, 'warpControl'), provider, null);

  const teams = await control.getTeams();
};

runMethodSafe(scoring);
