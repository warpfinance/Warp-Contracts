import { ethers } from "ethers"
import moment from "moment"
import { getLogger } from "./logger"

const logger = getLogger("util::getBlockByTime");

// Based on https://github.com/ethfinex/efx-trustless-vol/blob/master/src/lib/getBlockByTime.js
/**
 * Find nearest block to given timestamp, expect timestamp in seconds
 */
export const getBlockByTime = async (provider: ethers.providers.Provider, targetTimestamp: number, lowerLimitStamp: number, higherLimitStamp: number) => {
  // target timestamp or last midnight
  targetTimestamp = targetTimestamp || moment.utc().startOf('day').unix()


  // decreasing average block size will decrease precision and also
  // decrease the amount of requests made in order to find the closest
  // block
  let averageBlockTime = 17 * 1.5

  // get current block number
  const currentBlockNumber = await provider.getBlockNumber();
  let block = await provider.getBlock(currentBlockNumber);
  console.log(`${currentBlockNumber} ${block.timestamp}`);

  let requestsMade = 0

  let blockNumber = currentBlockNumber

  while(block.timestamp > targetTimestamp){

    let decreaseBlocks = (block.timestamp - targetTimestamp) / averageBlockTime
    decreaseBlocks = Math.floor(decreaseBlocks)

    if(decreaseBlocks < 1){
      break
    }

    blockNumber -= decreaseBlocks

    block = await provider.getBlock(blockNumber);
    console.log(`1: ${blockNumber} ${block.timestamp}`);
    requestsMade += 1
  }

  // if we undershoot the day
  if(lowerLimitStamp && block.timestamp < lowerLimitStamp) {
    while(block.timestamp < lowerLimitStamp){
      blockNumber += 1

      block = await provider.getBlock(blockNumber);
      console.log(`2: ${blockNumber} ${block.timestamp}`);
      requestsMade += 1
    }
  }

  if(higherLimitStamp) {

    // if we ended with a block higher than we can
    // walk block by block to find the correct one
    if( block.timestamp >= higherLimitStamp ) {
      while(block.timestamp >= higherLimitStamp){
        blockNumber -= 1

        block = await provider.getBlock(blockNumber);
        console.log(`3: ${blockNumber} ${block.timestamp}`);
        requestsMade += 1
      }
    }

    // if we ended up with a block lower than the upper limit
    // walk block by block to make sure it's the correct one
    if(block.timestamp < higherLimitStamp) {

      while(block.timestamp < higherLimitStamp){
        blockNumber += 1

        if(blockNumber > blockNumber) break;

        const tempBlock = await provider.getBlock(blockNumber);
        console.log(`4: ${blockNumber} ${tempBlock.timestamp}`);

        // can't be equal or higher than upper limit as we want
        // to find the last block before that limit
        if(tempBlock.timestamp >= higherLimitStamp){
          break
        }

        block = tempBlock

        requestsMade += 1
      }
    }
  }

  const toDate = (ts: number) => {
    return new Date(ts);
  }

  logger.log( "tgt timestamp   ->", targetTimestamp)
  logger.log( "tgt date        ->", toDate(targetTimestamp))
  logger.log( "" )

  logger.log( "block timestamp ->", block.timestamp)
  logger.log( "block date      ->", toDate(block.timestamp))
  logger.log( "" )

  logger.log( "requests made   ->", requestsMade)

  return block
}