const truffleAssert = require("truffle-assertions");
const w3 = require("web3");
const utils = require("./utils.js");
const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

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
  truffleAssert.eventEmitted(txResult, eventName, ev => {
    res = ev;
    return true;
  });
  return res;
};

const getCreatedPair = async txResult => {
  const pairAddress = new Promise(resolve => {
    truffleAssert.eventEmitted(txResult, "PairCreated", ev => {
      resolve(ev.pair);
    });
  });

  return UniswapV2Pair.at(await pairAddress);
};

//await usdcToken.mint(usdcBTCPair.address, conversionRates.usdc.btc * minimumLiquidity);
const giveTokens = async (token, account, amount) => {
  const numDecimals = parseInt((await token.decimals()).toString());
  const oneUnit = (new BigNumber(10)).pow(numDecimals);
  const realAmount = (new BigNumber(amount)).times(oneUnit);
  //console.log(amount, numDecimals, realAmount.toString());
  console.log(await token.symbol(), amount, numDecimals, realAmount.toString());
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

contract("Setup Test Env", function(accounts) {
  it("Demo", async () => {
    const wbtcToken = await TestToken.new("WBTC", "WBTC");
    const daiToken = await TestToken.new("DAI", "DAI");
    const usdtToken = await TestToken.new("USDT", "USDT");
    usdtToken.setDecimals(6);
    const usdcToken = await TestToken.new("USDC", "USDC");
    usdcToken.setDecimals(6);
    const wethToken = await TestToken.new("WETH", "WETH");

    // Give root some tokens to get things started
    const minimumLiquidity = 1000 * 100;

    // conversionRates[token0][token1] = x
    // X of token0 = token1
    const conversionRates = {
      usdc: {
        btc: 14000,
        usdt: 1.01,
        dai: 1
      },
      eth: {
        btc: 34,
        usdt: 0.0017,
        usdc: 0.0017,
        dai: 0.0017
      }
    };

    const uniFactory = await UniswapV2Factory.new(accounts[0]);

    /* Pairs for conversions */

    const ethCPair = await getCreatedPair(
      await uniFactory.createPair(usdcToken.address, wethToken.address)
    );
    await giveEqualTokens(
      ethCPair.address,
      wethToken,
      usdcToken,
      conversionRates.eth.usdc,
      minimumLiquidity
    );
    await ethCPair.mint(accounts[0]);

    const usdcDaiPair = await getCreatedPair(
      await uniFactory.createPair(usdcToken.address, daiToken.address)
    );
    await giveEqualTokens(
      usdcDaiPair.address,
      daiToken,
      usdcToken,
      conversionRates.usdc.dai,
      minimumLiquidity
    );
    await usdcDaiPair.mint(accounts[0]);
    

    const uniRouter = await UniswapV2Router02.new(
      uniFactory.address,
      wethToken.address
    );

    const testOracleUSDCEth = await UniswapLPOracleInstance.new(uniFactory.address, usdcToken.address, wethToken.address);
    const testOracleUSDCDai = await UniswapLPOracleInstance.new(uniFactory.address, usdcToken.address, daiToken.address);


    await utils.increaseTime(ONE_DAY);

    console.log("token0: " + await testOracleUSDCEth.token0());
    console.log("usdc: " + usdcToken.address)

    await usdcDaiPair.sync();
    await ethCPair.sync();

    await testOracleUSDCDai.update();

    await utils.increaseTime(ONE_DAY);

    await testOracleUSDCEth.update();

    
    console.log("price0avg=" + await testOracleUSDCEth.price0Average());
    console.log("price1avg=" +  await testOracleUSDCEth.price1Average());
    console.log("viewPriceNew=" + await testOracleUSDCEth.viewPrice(wethToken.address, toWei("1")));

    console.log("price0avg=" + await testOracleUSDCDai.price0Average());
    console.log("price1avg=" +  await testOracleUSDCDai.price1Average());
    console.log("viewPriceNew=" + await testOracleUSDCDai.viewPrice(daiToken.address, toWei("1")));

    
    
    

    return;


    const lpFactory = await WarpVaultLPFactory.new();
    const scFactory = await WarpVaultSCFactory.new();
    const oracleFactory = await UniswapLPOracleFactory.new(
      usdcToken.address,
      uniFactory.address,
      uniRouter.address
    );

    const warpControl = await WarpControl.new(
      oracleFactory.address,
      lpFactory.address,
      scFactory.address,
      accounts[0]
    );
    // goodbye children, remember me...
    await oracleFactory.transferOwnership(warpControl.address);
    await lpFactory.transferOwnership(warpControl.address);
    await scFactory.transferOwnership(warpControl.address);





  });
});
