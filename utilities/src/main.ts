import { getLogger } from "./lib/util";
import { runMethodSafe } from "./lib/util/runner"

import { downloadData } from "./scripts/downloadData";
import { getExpectedFilepath, setMainOutputId } from "./scripts/output";
import { scoreAccounts } from "./scripts/scoreAccounts";
import { scoreTeams } from "./scripts/scoreTeams";
import * as fs from 'fs';
import { ScoreDataHistoryResult } from "./lib/logic/gatherDataPoints";
import { exit } from "process";


const logger = getLogger('main');

const runAllScripts = async () => {
  logger.log(`Running all scripts`);

  if (process.argv.length < 3) {
    logger.error(`Please provide an id. This can be any series of letters or numbers like 'cat' or 'bongo'`);
    return;
  }

  const outputId = process.argv[2];
  logger.log(`Provided id is ${outputId}. Use this same id in future runs to re-use data.`);

  let checkPointData: ScoreDataHistoryResult | undefined;
  const possibleCheckpointFilepath = getExpectedFilepath('data', outputId);
  if (fs.existsSync(possibleCheckpointFilepath)) {
    logger.log(`Checkpoint file for id '${outputId}' exists.`);
    let fileContents: Maybe<string> = null;
    const filePath = possibleCheckpointFilepath;

    try {
      fileContents = fs.readFileSync(filePath).toString();
    } catch (e) {
      console.error(`Failed to load ${filePath}\n${e}`);
      console.error(`Please run again with a different id`);
      exit();
    }

    checkPointData = JSON.parse(fileContents) as ScoreDataHistoryResult;

    if (checkPointData.error) {
      console.warn(`Checkpoint file ${filePath} indicates an error occurred.`);
    }

    console.log(`Checkpoint file loaded successfully.`);
  }

  setMainOutputId(outputId);

  logger.log(`Downloading data...`);
  const data = await downloadData(checkPointData);
  logger.log(`Finished downloading data...`);

  logger.log(`Calculating account scores`);
  const accountScores = await scoreAccounts(data);
  logger.log(`Finished calculating account scores`);

  logger.log(`Calculating team scores`);
  await scoreTeams(accountScores);
}

runMethodSafe(runAllScripts);