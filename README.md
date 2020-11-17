# Warp Finance Smart Contracts

Do not delete the build folder!

The Warp Finance Protocol is a solidity based Smart-contract set designed to provide a platform
where users can earn interest for lending their stablecoins while using their LP tokens as collateral. By using LP
tokens as collateral for a loan, a user can effectively borrow with a negative interest rate as their LP tokens continue to earn the market fees from uniswap.

# Warp protocol structure:

The Warp protocol is made up of six main contracts.

The first of these contracts are the Uniswap Oracle contracts. These contracts are used by
the Warp Protocol to determine token value when evaluating the current conditions of a loan. These contracts are:

### UniswapLPOracleFactory.sol

    This contract facilitates communication between the Warp Control contract and UniswapLPOracleInstance contracts.

### UniswapLPOracleInstance.sol

    These contracts are produced by the UniswapLPOracleFactory contract for each asset
    that makes up a liquidity pair that an LP token represents. This is used to determiine the price of an LP token based on the assets it represents.

The second set of contracts are the Warp Vault contracts. These contracts are responsible
for managing an asset.

### WarpVaultLP.sol

    The WarpVaultLP contract is designed to manage a specific LP token. Each LP token Whitelisted by the Warp Protocol has its own WarpVaultLP contract.

### WarpVaultSC.sol

    The WarpVaultSC contract is designed to manage a specific StableCoin. Each StableCoin Whitelisted by the Warp Protocol has its own WarpVaultSC contract. These contracts handle a majority of the lending and borrowing logic for the platform in conjunction with compound's InterestRateModel contracts.

In addition to the WarpVaultSC contract, the Warp Protocol also employs a WarpWrapperToken contract to help with platform accounting.

### WarpWrapperToken.sol

    The WarpWrapperToken contracts are used as an accounting method to track a lenders pool share when they lend a stablecoin to a WarpVaultSC contract. Each WarpVaultSC manages its own respective WarpWrapperToken.

The final main contract in the Warp Protocol is the WarpControl contract.

### WarpControl.sol

    The WarpControl contract is the center peice of the Warp Protocol. This contract is responsible for coordinating lending and borrowing across all of the other Warp contracts.

## Test enviornment set-up

The following are the step-by- step commands to set up various testing environments

### Clone the Warp Protocol:

    In the directory of your choice run the command:
        git clone https://github.com/warpfinance/Warp.git

    Then cd into the Smart-Contract folder:
        cd Smart-Contract

    Install dependencies:
        npm install -g ganache-cli truffle
        npm install

### Set up enviornment for front end tests:

    start a local ganache chain using:
        ganache cli

    In a seperate terminal run :

    truffle test ./test/setuptextenv.ts

This will deploy a local version of uniswap, all Warp contracts AND test tokens for
USDC, USDT, DAI, Wrapped Bitcoin and Wrapped ETH. it will the list these tokens to Uniswap and provide you with the appropriate LP tokens.
