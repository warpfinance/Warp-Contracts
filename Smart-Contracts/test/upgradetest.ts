const truffleAssert = require("truffle-assertions");
const w3 = require("web3");
const utils = require("./utils.js");
const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const toWei = w3.utils.toWei;
const fromWei = w3.utils.fromWei;

const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WarpControl = artifacts.require("WarpControl");
const WarpVaultLP = artifacts.require("WarpVaultLP");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpVaultSC = artifacts.require("WarpVaultSC");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const UniswapLPOracleInstance = artifacts.require("UniswapLPOracleInstance");
const WarpWrapperToken = artifacts.require("WarpWrapperToken");
const ERC20 = artifacts.require("ERC20");
const TestToken = artifacts.require("TesterToken");

const ONE_DAY = 1000 * 86400;

//await usdcToken.mint(usdcBTCPair.address, conversionRates.usdc.btc * minimumLiquidity);
const giveTokens = async (token, account, amount) => {
  const numDecimals = parseInt((await token.decimals()).toString());
  const oneUnit = new BigNumber(10).pow(numDecimals);
  const realAmount = new BigNumber(amount).times(oneUnit);
  //console.log(amount, numDecimals, realAmount.toString());
  await token.mint(account, realAmount.toString());
};

//await giveTokens(usdcToken, usdcBTCPair.address, conversionRates.usdc.btc * minimumLiquidity)
//await giveTokens(wbtcToken, usdcBTCPair.address,  1 / conversionRates.usdc.btc * minimumLiquidity)
const giveEqualTokens = async (account, token0, token1, conversion, amount) => {
  await giveTokens(token0, account, conversion * amount);
  await giveTokens(token1, account, amount);
};

const giveLPTokens = async (
  account,
  lpToken,
  token0,
  token1,
  conversion,
  amount
) => {
  await giveEqualTokens(lpToken.address, token0, token1, conversion, amount);
  await lpToken.mint(account);
};

contract("Upgrade test", function(accounts) {
  it("testing upgrade", async () => {
    const wbtcToken = await TestToken.new("WBTC", "WBTC");
    const daiToken = await TestToken.new("DAI", "DAI");
    const usdtToken = await TestToken.new("USDT", "USDT");
    await usdtToken.setDecimals(6);
    const usdcToken = await TestToken.new("USDC", "USDC");
    await usdcToken.setDecimals(6);
    const wethToken = await TestToken.new("WETH", "WETH");

    // Give root some tokens to get things started
    const minimumLiquidity = 1000 * 100;

    // conversionRates[token0][token1] = x
    // X of token0 = token1
    const conversionRates = {
      usdc: {
        btc: 14000,
        usdt: 1.0,
        dai: 1.0
      },
      eth: {
        btc: 34,
        usdt: 0.002,
        usdc: 0.002,
        dai: 0.002
      }
    };

    const uniFactory = await UniswapV2Factory.new(accounts[0]);

    /* Pairs for conversions */
    await uniFactory.createPair(usdcToken.address, wbtcToken.address)
    const usdcBTCPair = await UniswapV2Pair.at(await uniFactory.getPair(usdcToken.address, wbtcToken.address));

    await giveEqualTokens(
      usdcBTCPair.address,
      usdcToken,
      wbtcToken,
      conversionRates.usdc.btc,
      minimumLiquidity
    );
    await usdcBTCPair.mint(accounts[0]);
    await usdcBTCPair.sync();




    await uniFactory.createPair(usdcToken.address, daiToken.address)
    const usdcDaiPair = await UniswapV2Pair.at(await uniFactory.getPair(usdcToken.address, daiToken.address));

    await giveEqualTokens(
      usdcDaiPair.address,
      usdcToken,
      daiToken,
      conversionRates.usdc.dai,
      minimumLiquidity
    );
    await usdcDaiPair.mint(accounts[0]);
    await usdcDaiPair.sync();




    /* Warp Support pairs */
    await uniFactory.createPair(wethToken.address, wbtcToken.address)
    const ethBtcPair = await UniswapV2Pair.at(await uniFactory.getPair(wethToken.address, wbtcToken.address));

    await giveEqualTokens(
      ethBtcPair.address,
      wethToken,
      wbtcToken,
      conversionRates.eth.btc,
      minimumLiquidity
    );
    await ethBtcPair.mint(accounts[0]);
    await ethBtcPair.sync();

    await uniFactory.createPair(wethToken.address, usdcToken.address)
    const ethCPair = await UniswapV2Pair.at(await uniFactory.getPair(wethToken.address, usdcToken.address));

    await giveEqualTokens(
      ethCPair.address,
      wethToken,
      usdcToken,
      conversionRates.eth.usdc,
      minimumLiquidity
    );
    await ethCPair.mint(accounts[0]);
    await ethCPair.sync();

    const uniRouter = await UniswapV2Router02.new(
      uniFactory.address,
      wethToken.address
    );

    const lpFactory = await WarpVaultLPFactory.new();
    const scFactory = await WarpVaultSCFactory.new();
    const oracleFactory = await UniswapLPOracleFactory.new(
      usdcToken.address,
      uniFactory.address,
      uniRouter.address
    );

    await utils.increaseTime(ONE_DAY / 2);

    const warpControl = await WarpControl.new(
      oracleFactory.address,
      lpFactory.address,
      scFactory.address,
      accounts[2]
    );
    await oracleFactory.transferOwnership(warpControl.address);


    // Create LP Vaults
    await warpControl.createNewLPVault(
      0,
      ethBtcPair.address,
      wethToken.address,
      wbtcToken.address,
      "ETH-BTC-LP"
    );

    // Create Stable Coin Vaults
    await warpControl.createNewSCVault(
      0,
      "20000000000000000",
      "22222222222200000",
      "40",
      "900000000000000000",
      "1000000000000000000",
      "500000000000000000", //reserve factor for fees
      daiToken.address
    );

    await oracleFactory.getUnderlyingPrice(ethBtcPair.address)

    await utils.increaseTime(ONE_DAY);

    const upgradedWarpControl = await WarpControl.new(
      oracleFactory.address,
      lpFactory.address,
      scFactory.address,
      accounts[0]
    );

    await warpControl.startUpgradeTimer(upgradedWarpControl.address);

    await truffleAssert.fails(warpControl.upgradeWarp());

    await utils.increaseTime(ONE_DAY * 3);

    const daiVault = await WarpVaultSC.at(await warpControl.instanceSCTracker(daiToken.address));
    const lpVault = await WarpVaultLP.at(await warpControl.instanceLPTracker(ethBtcPair.address));

    assert(await oracleFactory.owner() == warpControl.address);
    assert(await lpVault.warpControl() == warpControl.address);
    assert(await daiVault.warpControl() == warpControl.address);

    await warpControl.upgradeWarp();

    assert(await oracleFactory.owner() == upgradedWarpControl.address);
    assert(await lpVault.warpControl() == upgradedWarpControl.address);
    assert(await daiVault.warpControl() == upgradedWarpControl.address);

  });
});
