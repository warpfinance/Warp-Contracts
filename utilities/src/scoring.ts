import { getLogger } from './lib/util';
import { runMethodSafe } from './lib/util/runner';

require('dotenv').config();

const logger = getLogger('datapoints');

const scoring = async () => {
    logger.log(process.argv.length);
    logger.log(process.argv);
};

runMethodSafe(scoring);
