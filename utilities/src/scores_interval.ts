import { ethers } from "ethers";
import moment from "moment";

import { WarpControlService } from "./lib/contracts/warpControlService";
import { getBlockByTime, getLogger } from "./lib/util";
import { getContractAddress, getTokensByNetwork } from "./lib/util/networks";

require('dotenv').config();

const logger = getLogger("Scores");

const infuraKey = process.env["INFURA_KEY"];

const origin = Date.parse("2020-12-9 18:00:00.000 GMT");
const intervals = 6;

if (!infuraKey) {
  logger.error(`No infura key provided!`);
  throw Error(`No infura key`);
}

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

const calculateScores = async () => {
  const context = { 
    provider: new ethers.providers.InfuraProvider("homestead", infuraKey),
    networkId: 1
  }
  const { provider, networkId } = context;

  const control = new WarpControlService(getContractAddress(networkId, 'warpControl'), provider, null);
  const scTokens = getTokensByNetwork(networkId, false);
  const lpTokens = getTokensByNetwork(networkId, true);

  const start = moment(origin).add(1, "days").valueOf();
  const end = moment(start).add(1, "days").valueOf();
  const duration = end - start;
  const intervalLength = duration / intervals;
  const settingPadding = 20;
  logger.log(`Current Settings\n${"Start Date:".padEnd(settingPadding)}${moment(start).format()}\n${"End Date:".padEnd(settingPadding)}${moment(end).format()}\n${"Intervals:".padEnd(settingPadding)}${intervals}\n${"Interval Length:".padEnd(settingPadding)}${moment.duration(intervalLength).humanize()}`);

  const intervalTimes: number[] = [];

  for (let i = 1; i <= intervals; ++i) {
    const intervalTime = start + (intervalLength * i);
    logger.debug(`Interval ${i} is at ${moment(intervalTime).format()}`);

    intervalTimes.push(intervalTime); // convert to UNIX timestamp
  }

  for (const intervalTime of intervalTimes) {
    const min = moment(intervalTime).subtract(30, "seconds").unix();
    const max = moment(intervalTime).add(30, "seconds").unix();
    const block = await getBlockByTime(provider, moment(intervalTime).unix(), min, max);
  }







  //getBlockByTime(provider, now, now + moment.duration(7, "days"))



}



const doCalculate = async () => {
  try {
    await calculateScores();
  } catch (e) {
    console.error("encountered an error");
    console.error(e);
  }
}

doCalculate();