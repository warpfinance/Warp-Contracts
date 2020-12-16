# Warp Finance Smart Contracts

Do not delete the build folder!

The Warp Finance Protocol is a solidity based Smart-contract set designed to provide a platform
where users can earn interest for lending their stablecoins while using their LP tokens as collateral. By using LP
tokens as collateral for a loan, a user can effectively borrow with a negative interest rate as their LP tokens continue to earn the market fees from uniswap.

# Warp contract addresses:

### [Oracle](https://etherscan.io/address/0x4A224CD0517f08B26608a2f73bF390b01a6618c8)
### [Control](https://etherscan.io/address/0xBa539B9a5C2d412Cb10e5770435f362094f9541c)
### [wETH-DAI LP Vault](https://etherscan.io/address/0x13db1CB418573f4c3A2ea36486F0E421bC0D2427)
### [wBTC-wETH LP Vault](https://etherscan.io/address/0x3c37f97F7d8f705cc230f97a0668f77a0e05D0aA)
### [USDT-wETH LP Vault](https://etherscan.io/address/0xCDb97F4C32F065b8e93cF16BB1E5d198bcF8cA0d)
### [USDC-wETH LP Vault](https://etherscan.io/address/0xb64dfae5122D70Fa932f563c53921FE33967B3E0)
### [DAI SC Vault](https://etherscan.io/address/0x6046c3Ab74e6cE761d218B9117d5c63200f4b406)
### [USDC SC Vault](https://etherscan.io/address/0xae465FD39B519602eE28F062037F7B9c41FDc8cF)
### [USDT SC Vault](https://etherscan.io/address/0xDadd9bA311192d360Df13395E137f1E673C91deB)

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
        yarn

### Set up enviornment for front end tests:

    start a local ganache chain using:
        ganache-cli

    In a separate terminal run :

    truffle test ./test/setuptestenv.ts

This will deploy a local version of uniswap, all Warp contracts AND test tokens for
USDC, USDT, DAI, Wrapped Bitcoin and Wrapped ETH. it will the list these tokens to Uniswap and provide you with the appropriate LP tokens.
