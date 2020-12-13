import { ethers } from "ethers";
import { id } from "ethers/lib/utils";
import moment from "moment";
import { WarpLPVaultService } from "./lib/contracts";
import { StableCoinWarpVaultService } from "./lib/contracts/stableCoinWarpVault";

import { WarpControlService } from "./lib/contracts/warpControlService";
import { getBlockByTime, getLogger } from "./lib/util";
import { getContractAddress, getTokensByNetwork } from "./lib/util/networks";

require('dotenv').config();

const logger = getLogger("Scores");

const infuraKey = process.env["INFURA_KEY"];

const origin = Date.parse("2020-12-9 18:00:00.000 GMT");

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
  const settingPadding = 20;
  logger.log(`Current Settings\n${"Start Date:".padEnd(settingPadding)}${moment(start).format()}\n${"End Date:".padEnd(settingPadding)}${moment(end).format()}`);

  const getBlockNearTime = async (time: number) => {
    const min = moment(time).subtract(30, "seconds").unix();
    const max = moment(time).add(30, "seconds").unix();
    const block = await getBlockByTime(provider, moment(time).unix(), min, max);
    return block;
  }

  const startBlock = await getBlockNearTime(start);
  const endBlock = await provider.getBlock(provider.blockNumber);//await getBlockNearTime(end);
  const numBlocks = endBlock.number - startBlock.number;

  logger.log(`Search area is ${numBlocks} blocks.`);

  const blocksToQuery = new Set<number>();

  for (const stablecoin of scTokens) {
    const vaultAddress = await control.getStableCoinVault(stablecoin.address);
    const vault = new StableCoinWarpVaultService(vaultAddress, provider, null);

    const testFilter = await vault.contract.filters.StableCoinLent(null, null, null);
    const events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${stablecoin.symbol} vault`);

    events.map((e: ethers.Event) => {
      return e.blockNumber;
    }).forEach((blockNumber: number) => {
      blocksToQuery.add(blockNumber);
    });

  }

  for (const lpToken of lpTokens) {
    const vaultAddress = await control.getLPVault(lpToken.address);
    const vault = new WarpLPVaultService(vaultAddress, provider, null);

    // get deposits
    let testFilter = await vault.contract.filters.CollateralProvided(null, null);
    let events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} deposits`);

    events.map((e: ethers.Event) => {
      return e.blockNumber;
    }).forEach((blockNumber: number) => {
      blocksToQuery.add(blockNumber);
    });

    // get withdraws
    testFilter = await vault.contract.filters.CollateralWithdraw(null, null);
    events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} withdraws`);

    events.map((e: ethers.Event) => {
      return e.blockNumber;
    }).forEach((blockNumber: number) => {
      blocksToQuery.add(blockNumber);
    });
  }

  

  logger.log(`There are ${blocksToQuery.size} blocks to query.`);

  const queryBlocks = Array.from(blocksToQuery.values());

  for (const block of queryBlocks) {
    logger.log(`Need to query block number ${block}`);
  }
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