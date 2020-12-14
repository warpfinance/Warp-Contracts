import { ethers } from "ethers";
import { id } from "ethers/lib/utils";
import moment from "moment";
import { WarpLPVaultService } from "./lib/contracts";
import { StableCoinWarpVaultService } from "./lib/contracts/stableCoinWarpVault";

import { WarpControlService } from "./lib/contracts/warpControlService";
import { getUserTVL, GetUserTVLConfig, ScTokenVault, UserTVL } from "./lib/logic/tvl";
import { getBlockByTime, getLogger, parseBigNumber, setTransactionCallBlockNumber, Token } from "./lib/util";
import { getContractAddress, getTokensByNetwork } from "./lib/util/networks";

require('dotenv').config();

const logger = getLogger("Scores");

const infuraKey = process.env["INFURA_KEY"];

const origin = Date.parse("2020-12-9 18:16:00.000 GMT");

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

  let usdcToken: Maybe<Token> = null;
  for (const scToken of scTokens) {
    if (scToken.symbol === "USDC") {
      usdcToken = scToken;
    }
  }
  if (!usdcToken) {
    throw Error("No USDC token found");
  }

  const start = moment(origin).add(1, "days").valueOf();
  const end = moment(start).add(1, "days").valueOf();
  const settingPadding = 20;
  logger.log(`Current Settings\n${"Origin Date:".padEnd(settingPadding)}${moment(origin).format()}\n${"Start Date:".padEnd(settingPadding)}${moment(start).format()}\n${"End Date:".padEnd(settingPadding)}${moment(end).format()}`);

  const getBlockNearTime = async (time: number) => {
    const min = moment(time).subtract(30, "seconds").unix();
    const max = moment(time).add(30, "seconds").unix();
    const block = await getBlockByTime(provider, moment(time).unix(), min, max);
    return block;
  }

  const originBlock = await getBlockNearTime(origin);
  const startBlock = await getBlockNearTime(start);
  const endBlock = await getBlockNearTime(end); //await provider.getBlock(provider.blockNumber);
  const numBlocks = endBlock.number - originBlock.number;



  logger.log(`Search area is ${numBlocks} blocks.`);

  interface BlocksOfInterest {
    [blockNumber: number]: {
      accounts: string[]
    }
  }

  const blocksToQuery: BlocksOfInterest = {};

  for (const stablecoin of scTokens) {
    const vaultAddress = await control.getStableCoinVault(stablecoin.address);
    const vault = new StableCoinWarpVaultService(vaultAddress, provider, null);

    const testFilter = await vault.contract.filters.StableCoinLent(null, null, null);
    const events = await vault.contract.queryFilter(testFilter, originBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${stablecoin.symbol} vault`);

    events.forEach((e: ethers.Event) => {
      const blockNumber = e.blockNumber;

      let blockToQuery = blocksToQuery[blockNumber];
      if (!blockToQuery) {
        blocksToQuery[blockNumber] = { accounts: []};
        blockToQuery = blocksToQuery[blockNumber];
      }

      if (!e.args) {
        logger.error("no args for event");
        return;
      }
      

      blockToQuery.accounts.push(e.args[0]);
    });
  }

  for (const lpToken of lpTokens) {
    const vaultAddress = await control.getLPVault(lpToken.address);
    const vault = new WarpLPVaultService(vaultAddress, provider, null);

    // get deposits
    let testFilter = await vault.contract.filters.CollateralProvided(null, null);
    let events = await vault.contract.queryFilter(testFilter, originBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} deposits`);

    events.forEach((e: ethers.Event) => {
      const blockNumber = e.blockNumber;

      let blockToQuery = blocksToQuery[blockNumber];
      if (!blockToQuery) {
        blocksToQuery[blockNumber] = { accounts: []};
        blockToQuery = blocksToQuery[blockNumber];
      }

      if (!e.args) {
        logger.error("no args for event");
        return;
      }
      

      blockToQuery.accounts.push(e.args[0]);
    });

    // get withdraws
    testFilter = await vault.contract.filters.CollateralWithdraw(null, null);
    events = await vault.contract.queryFilter(testFilter, originBlock.number, endBlock.number);
    logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} withdraws`);

    events.forEach((e: ethers.Event) => {
      const blockNumber = e.blockNumber;

      let blockToQuery = blocksToQuery[blockNumber];
      if (!blockToQuery) {
        blocksToQuery[blockNumber] = { accounts: []};
        blockToQuery = blocksToQuery[blockNumber];
      }

      if (!e.args) {
        logger.error("no args for event");
        return;
      }
      

      blockToQuery.accounts.push(e.args[0]);
    });
  }

  logger.debug(`Adding start and end blocks`);

  //const participants = await control.getLaunchParticipants();
  // blocksToQuery[startBlock.number] = {accounts: participants};
  // blocksToQuery[endBlock.number] = {accounts: participants};

  logger.log(`There are ${Object.entries(blocksToQuery).length} blocks to query.`);

  const queryBlocks = Object.keys(blocksToQuery).map(v => parseInt(v)).sort();

  logger.log(JSON.stringify(queryBlocks));

  const scTokenVaults: ScTokenVault[] = [];
  for (const scToken of scTokens) {
    const vaultAddress = await control.getStableCoinVault(scToken.address);
    const vault = new StableCoinWarpVaultService(vaultAddress, provider, null);
    const usdcValue = parseBigNumber(await control.getStableCoinPrice(scToken.address), usdcToken.decimals); 
    scTokenVaults.push({
      token: scToken,
      vault,
      valueInUSDC: usdcValue
    })
  }

  

  interface AccountScoreDataPoint {
    account: string;
    blockNumber: number;
    tvl: UserTVL
  }

  interface ScoreDataPoint {
    [account: string]: AccountScoreDataPoint
  }

  interface ScoreDataHistory {
    [blockNumber: number]: {
      data: ScoreDataPoint,
      blockNumber: number
    }
  }

  const dataPoints: ScoreDataHistory = {};

  const cachedConfig: GetUserTVLConfig = {
    control,
    scVaults: scTokenVaults,
    usdcToken
  };

  for (const blockNumber of queryBlocks) {
    logger.log(`Getting data from block number ${blockNumber}`);
    setTransactionCallBlockNumber(blockNumber);

    const blockDataPoints: ScoreDataPoint = {};
    const blockParticipants = blocksToQuery[blockNumber].accounts;
    logger.log(`${blockParticipants.length} accounts to get data from`);

    for (const account of blockParticipants) {
      const userTVLAtBlock = await getUserTVL(account, cachedConfig);
      logger.debug(`Calculated ${account} TVL as ${userTVLAtBlock.tvl.toFixed(0)} at block ${blockNumber}`);

      blockDataPoints[account] = {
        account,
        blockNumber,
        tvl: userTVLAtBlock
      }
    }

    dataPoints[blockNumber] = {
      blockNumber,
      data: blockDataPoints
    }
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