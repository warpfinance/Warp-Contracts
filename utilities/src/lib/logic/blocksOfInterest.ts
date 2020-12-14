import { ethers } from 'ethers';
import { StableCoinWarpVaultService, WarpControlService, WarpLPVaultService } from '../contracts';
import { getLogger, Token } from '../util';

export interface BlocksOfInterest {
    [blockNumber: number]: {
        accounts: string[];
    };
}

const logger = getLogger('Logic::blocksOfInterest');

export const getBlocksOfInterest = async (
    control: WarpControlService,
    scTokens: Token[],
    lpTokens: Token[],
    startBlock: ethers.providers.Block,
    endBlock: ethers.providers.Block,
): Promise<BlocksOfInterest> => {
    const blocksToQuery: BlocksOfInterest = {};

    for (const stablecoin of scTokens) {
        const vaultAddress = await control.getStableCoinVault(stablecoin.address);
        const vault = new StableCoinWarpVaultService(vaultAddress, control.provider, null);

        const testFilter = await vault.contract.filters.StableCoinLent(null, null, null);
        const events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
        logger.debug(`Found ${events.length} blocks of interest from ${stablecoin.symbol} vault`);

        events.forEach((e: ethers.Event) => {
            const blockNumber = e.blockNumber;

            let blockToQuery = blocksToQuery[blockNumber];
            if (!blockToQuery) {
                blocksToQuery[blockNumber] = { accounts: [] };
                blockToQuery = blocksToQuery[blockNumber];
            }

            if (!e.args) {
                logger.error(`no args for event at block ${e.blockNumber}`);
                return;
            }

            blockToQuery.accounts.push(e.args[0]);
        });
    }

    for (const lpToken of lpTokens) {
        const vaultAddress = await control.getLPVault(lpToken.address);
        const vault = new WarpLPVaultService(vaultAddress, control.provider, null);

        // get deposits
        let testFilter = await vault.contract.filters.CollateralProvided(null, null);
        let events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
        logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} deposits`);

        events.forEach((e: ethers.Event) => {
            const blockNumber = e.blockNumber;

            let blockToQuery = blocksToQuery[blockNumber];
            if (!blockToQuery) {
                blocksToQuery[blockNumber] = { accounts: [] };
                blockToQuery = blocksToQuery[blockNumber];
            }

            if (!e.args) {
                logger.error(`no args for event at block ${e.blockNumber}`);
                return;
            }

            blockToQuery.accounts.push(e.args[0]);
        });

        // get withdraws
        testFilter = await vault.contract.filters.CollateralWithdraw(null, null);
        events = await vault.contract.queryFilter(testFilter, startBlock.number, endBlock.number);
        logger.debug(`Found ${events.length} blocks of interest from ${lpToken.symbol} withdraws`);

        events.forEach((e: ethers.Event) => {
            const blockNumber = e.blockNumber;

            let blockToQuery = blocksToQuery[blockNumber];
            if (!blockToQuery) {
                blocksToQuery[blockNumber] = { accounts: [] };
                blockToQuery = blocksToQuery[blockNumber];
            }

            if (!e.args) {
                logger.error(`no args for event at block ${e.blockNumber}`);
                return;
            }

            blockToQuery.accounts.push(e.args[0]);
        });
    }

    return blocksToQuery;
};
