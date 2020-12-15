import { getContractAddress, getDateString, getLogger } from './lib/util';
import { runMethodSafe } from './lib/util/runner';
import * as fs from 'fs';
import { infuraKey } from './config';
import { ethers } from 'ethers';
import { AccountScores } from './lib/logic/scoreAccounts';
import { WarpControlService } from './lib/contracts';
import { calculateTeamScores, TeamScore } from './lib/logic/scoreTeams';
import { getTeams } from './lib/logic/teamHelpers';

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

  const accountScores = JSON.parse(fileContents) as AccountScores;

  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider, networkId } = context;

  const control = new WarpControlService(getContractAddress(networkId, 'warpControl'), provider, null);

  const teams = await getTeams(control, true);
  const teamScoresMap = calculateTeamScores(accountScores, teams);

  const teamScoresList = Object.values(teamScoresMap).sort((a: TeamScore, b: TeamScore) => {
    return b.weightedScore - a.weightedScore;
  });

  const scoredTeams = {
    teams: teamScoresList,
    timestamp: new Date()
  }


  const timestamp = getDateString();
  const filename = `team_scores_${timestamp}.json`;
  logger.log(`Saving data as ${filename} on disk`);

  const toWriteContents = JSON.stringify(scoredTeams);
  fs.writeFileSync(filename, toWriteContents);
};

runMethodSafe(scoring);
