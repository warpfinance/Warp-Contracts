import { getLogger } from "./lib/util";
import { runMethodSafe } from "./lib/util/runner"

import { downloadData } from "./scripts/downloadData";
import { scoreAccounts } from "./scripts/scoreAccounts";
import { scoreTeams } from "./scripts/scoreTeams";

const logger = getLogger('main');

const runAllScripts = async () => {
  logger.log(`Running all scripts`);

  logger.log(`Downloading data...`);
  const data = await downloadData();
  logger.log(`Finished downloading data...`);

  logger.log(`Calculating account scores`);
  const accountScores = await scoreAccounts(data);
  logger.log(`Finished calculating account scores`);

  logger.log(`Calculating team scores`);
  await scoreTeams(accountScores);
}

runMethodSafe(runAllScripts);