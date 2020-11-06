
const truffleAssert = require("truffle-assertions");
const w3 = require("web3");
const utils = require("./utils.js");

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

const getEvent = async (txResult, eventName) => {
  let res = undefined;
  truffleAssert.eventEmitted(txResult, eventName, (ev) => {
    res = ev;
    return true;
  });
  return res;
}

const getCreatedPair = async (txResult) => {
  const pairAddress = new Promise((resolve) => {
    truffleAssert.eventEmitted(txResult, "PairCreated", (ev) => {
      resolve(ev.pair);
    });
  });

  return UniswapV2Pair.at(await pairAddress);
} 

//await usdcToken.mint(usdcBTCPair.address, conversionRates.usdc.btc * minimumLiquidity);
const giveTokens = async (token, account, amount) => {
  const inWei = toWei(amount.toString());
  await token.mint(account, inWei);
}

//await giveTokens(usdcToken, usdcBTCPair.address, conversionRates.usdc.btc * minimumLiquidity)
//await giveTokens(wbtcToken, usdcBTCPair.address,  1 / conversionRates.usdc.btc * minimumLiquidity)
const giveEqualTokens = async (account, token0, token1, conversion, amount) => {
  await giveTokens(token0, account, conversion * amount);
  await giveTokens(token1, account, amount);
}

contract("Warp Finance Demo", function (accounts) {

  it("Demo", async () => {
    const wbtcToken = await TestToken.new("WBTC", "WBTC");
    const daiToken = await TestToken.new("DAI", "DAI");
    const usdtToken = await TestToken.new("USDT", "USDT");
    const usdcToken = await TestToken.new("USDC", "USDC");
    const wethToken = await TestToken.new("WETH", "WETH");

    // Give root some tokens to get things started
    const minimumLiquidity = 1000 * 100;

    // conversionRates[token0][token1] = x
    // X of token0 = token1
    const conversionRates = {
      usdc: {
        btc: 14000,
        usdt: 1.01,
        dai: 1.0,
      },
      eth: {
        btc: 34,
        usdt: 0.00247,
        usdc: 0.00247,
        dai: 0.00247,
      },
    }

    const uniFactory = await UniswapV2Factory.new(accounts[0]);

    /* Pairs for conversions */
    const usdcBTCPair = await getCreatedPair(await uniFactory.createPair(usdcToken.address, wbtcToken.address));
    await giveEqualTokens(usdcBTCPair.address, usdcToken, wbtcToken, conversionRates.usdc.btc, minimumLiquidity);
    await usdcBTCPair.mint(accounts[0]);

    const usdctPair = await getCreatedPair(await uniFactory.createPair(usdcToken.address, usdtToken.address));
    await giveEqualTokens(usdctPair.address, usdcToken, usdtToken, conversionRates.usdc.usdt, minimumLiquidity);
    await usdctPair.mint(accounts[0]);

    const usdcDaiPair = await getCreatedPair(await uniFactory.createPair(usdcToken.address, daiToken.address));
    await giveEqualTokens(usdcDaiPair.address, usdcToken, daiToken, conversionRates.usdc.dai, minimumLiquidity);
    await usdcDaiPair.mint(accounts[0]);


    /* Warp Support pairs */
    const ethBtcPair = await getCreatedPair(await uniFactory.createPair(wethToken.address, wbtcToken.address));
    await giveEqualTokens(ethBtcPair.address, wethToken, wbtcToken, conversionRates.eth.btc , minimumLiquidity);
    await ethBtcPair.mint(accounts[0]);

    const ethCPair = await getCreatedPair(await uniFactory.createPair(wethToken.address, usdcToken.address));
    await giveEqualTokens(ethCPair.address, wethToken, usdcToken, conversionRates.eth.usdc, minimumLiquidity);
    await ethCPair.mint(accounts[0]);

    const ethTPair = await getCreatedPair(await uniFactory.createPair(wethToken.address, usdtToken.address));
    await giveEqualTokens(ethTPair.address, wethToken, usdtToken, conversionRates.eth.usdt, minimumLiquidity);
    await ethTPair.mint(accounts[0]);

    const ethDaiPair = await getCreatedPair(await uniFactory.createPair(wethToken.address, daiToken.address));
    await giveEqualTokens(ethDaiPair.address, wethToken, daiToken, conversionRates.eth.dai, minimumLiquidity);
    await ethDaiPair.mint(accounts[0]);

    const uniRouter = await UniswapV2Router02.new(uniFactory.address, wethToken.address);

    const lpFactory = await WarpVaultLPFactory.new();
    const scFactory = await WarpVaultSCFactory.new();
    const oracleFactory = await UniswapLPOracleFactory.new(usdcToken.address, uniFactory.address, uniRouter.address);

    const warpControl = await WarpControl.new(oracleFactory.address, lpFactory.address, scFactory.address);
    // goodbye children, remember me...
    await oracleFactory.transferOwnership(warpControl.address);
    await lpFactory.transferOwnership(warpControl.address);
    await scFactory.transferOwnership(warpControl.address);

    // Create LP Vaults
    await warpControl.createNewLPVault(ethBtcPair.address, wethToken.address, wbtcToken.address, 'ETH-BTC-LP');
    // await warpControl.createNewLPVault(ethCPair.address, wethToken.address, usdcToken.address, 'ETH-BTC-LP');
    await warpControl.createNewLPVault(ethTPair.address, wethToken.address, usdtToken.address, 'ETH-USDT-LP');
    await warpControl.createNewLPVault(ethDaiPair.address, wethToken.address, daiToken.address, 'ETH-DAI-LP');

    // Create Stable Coin Vaults
    await warpControl.createNewSCVault("1000000000000000000", "2000000000000000000", "2000000000000000000", 4204800, "1000000000000000000", daiToken.address);
    await warpControl.createNewSCVault("1000000000000000000", "2000000000000000000", "2000000000000000000", 4204800, "1000000000000000000", usdtToken.address);
    await warpControl.createNewSCVault("1000000000000000000", "2000000000000000000", "2000000000000000000", 4204800, "1000000000000000000", usdcToken.address);

    await utils.increaseTime(ONE_DAY);

    // Test lending to vault
    const user1 = accounts[1];
    const daiInVault = 1000000;
    await daiToken.mint(user1, toWei(daiInVault.toString()));

    const daiWarpVault = await WarpVaultSC.at(await warpControl.instanceSCTracker(daiToken.address));
    await daiToken.approve(daiWarpVault.address, toWei('1000000000000'), {from: user1});
    await daiWarpVault.lendToWarpVault(toWei(daiInVault.toString()), {from: user1});

    const warpWrapperToken = await WarpWrapperToken.at(await daiWarpVault.wStableCoin());
    expect(fromWei(await warpWrapperToken.balanceOf(user1))).equals(daiInVault.toString());


    // Test providing LP to vault as collateral
    const user2 = accounts[2];

    // Give user 2 some LP tokens for ETH-wBTC

    // We have 2x1000 $ in collateral
    const lpInDollars = 10000;
    // Put ~50% of it into the Warp LP Vault ($1000)
    const collateralProportion = 0.5;

    await giveEqualTokens(ethDaiPair.address, wethToken, daiToken, conversionRates.eth.dai, lpInDollars);
    await ethDaiPair.mint(user2);

    const initialLPBalance = parseFloat(fromWei(await ethDaiPair.balanceOf(user2)));

    const amountOfLPToProvide = initialLPBalance * collateralProportion;

    const ethDaiVault = await WarpVaultLP.at(await warpControl.instanceLPTracker(ethDaiPair.address));
    await ethDaiPair.approve(ethDaiVault.address, toWei('10000000000'), {from: user2});
    await ethDaiVault.provideCollateral(toWei(amountOfLPToProvide.toString()), {from: user2});

    const postLPBalance = parseFloat(fromWei(await ethDaiPair.balanceOf(user2)));
    expect(postLPBalance).lessThan(initialLPBalance);
    const givenLP = initialLPBalance - postLPBalance;

    const calcAPY = (borrowRate) => {
      const ethMantissa = 1e18;
      const blocksPerDay = 4 * 60 * 24;
      const daysPerYear = 365;

      const borrowApy = (((Math.pow((borrowRate / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;

      return borrowApy;
    }


    // Test getting a loan based on provided collateral
    //const borrowLimit = await warpControl.getTotalAvailableCollateralValue(user2);

    console.log(calcAPY((await daiWarpVault.borrowRatePerBlock()).toNumber()));
   
    await oracleFactory.getUnderlyingPrice(ethDaiPair.address);
    const priceOfLP = parseFloat(fromWei(await oracleFactory.viewUnderlyingPrice(ethDaiPair.address)));

    // Take out a loan for 30% of the value of the LP we put in
    const loanAmount = givenLP * priceOfLP * 0.3;
    await warpControl.borrowSC(daiToken.address, toWei(loanAmount.toString()), {from: user2});

    // Check how much DAI we have (assumes 1 DAI === 1 USDC)
    const daiBorrowed = await daiToken.balanceOf(user2);
    expect(parseFloat(fromWei(daiBorrowed))).eq(loanAmount);

    console.log(calcAPY((await daiWarpVault.borrowRatePerBlock()).toNumber()));

    // interest rates do go up, but they seem really high
    
  });

});
