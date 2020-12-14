import { getLogger } from './lib/util';
import { runMethodSafe } from './lib/util/runner';
import * as fs from 'fs';
import { ScoreDataHistoryResult } from './lib/logic/gatherDataPoints';

require('dotenv').config();

const logger = getLogger('datapoints');

const scoring = async () => {
  if (process.argv.length < 3) {
    logger.error(`a 'filepath' parameter is required. Pass in the name of the data json file in the cli`);
    return;
  }
  const filePath = process.argv[2];

  console.log(`Loading dat from ${filePath}`);

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

  const dataPoints = dataFile.data;
  


};

runMethodSafe(scoring);
