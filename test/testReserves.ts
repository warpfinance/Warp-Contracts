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

contract("Control", function(accounts) {
  it("Calculates Reserves after one year", async () => {
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
    const usdcBTCPair = await getCreatedPair(
      await uniFactory.createPair(usdcToken.address, wbtcToken.address)
    );
    await giveEqualTokens(
      usdcBTCPair.address,
      usdcToken,
      wbtcToken,
      conversionRates.usdc.btc,
      minimumLiquidity
    );
    await usdcBTCPair.mint(accounts[0]);
    await usdcBTCPair.sync();

    const usdctPair = await getCreatedPair(
      await uniFactory.createPair(usdcToken.address, usdtToken.address)
    );
    await giveEqualTokens(
      usdctPair.address,
      usdcToken,
      usdtToken,
      conversionRates.usdc.usdt,
      minimumLiquidity
    );
    await usdctPair.mint(accounts[0]);
    await usdctPair.sync();

    const usdcDaiPair = await getCreatedPair(
      await uniFactory.createPair(usdcToken.address, daiToken.address)
    );
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
    const ethBtcPair = await getCreatedPair(
      await uniFactory.createPair(wethToken.address, wbtcToken.address)
    );
    await giveEqualTokens(
      ethBtcPair.address,
      wethToken,
      wbtcToken,
      conversionRates.eth.btc,
      minimumLiquidity
    );
    await ethBtcPair.mint(accounts[0]);
    await ethBtcPair.sync();

    const ethCPair = await getCreatedPair(
      await uniFactory.createPair(wethToken.address, usdcToken.address)
    );
    await giveEqualTokens(
      ethCPair.address,
      wethToken,
      usdcToken,
      conversionRates.eth.usdc,
      minimumLiquidity
    );
    await ethCPair.mint(accounts[0]);

    const ethTPair = await getCreatedPair(
      await uniFactory.createPair(wethToken.address, usdtToken.address)
    );
    await giveEqualTokens(
      ethTPair.address,
      wethToken,
      usdtToken,
      conversionRates.eth.usdt,
      minimumLiquidity
    );
    await ethTPair.mint(accounts[0]);

    const ethDaiPair = await getCreatedPair(
      await uniFactory.createPair(wethToken.address, daiToken.address)
    );
    await giveEqualTokens(
      ethDaiPair.address,
      wethToken,
      daiToken,
      conversionRates.eth.dai,
      minimumLiquidity
    );
    await ethDaiPair.mint(accounts[0]);

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

    const warpControl = await WarpControl.new(
      oracleFactory.address,
      lpFactory.address,
      scFactory.address,
      accounts[0]
    );
    // goodbye children, remember me...
    await oracleFactory.transferOwnership(warpControl.address);

    // Create LP Vaults
    await warpControl.createNewLPVault(
      0,
      ethBtcPair.address,
      wethToken.address,
      wbtcToken.address,
      "ETH-BTC-LP"
    );
    await warpControl.createNewLPVault(
      0,
      ethCPair.address,
      wethToken.address,
      usdcToken.address,
      "ETH-BTC-LP"
    );
    await warpControl.createNewLPVault(
      0,
      ethTPair.address,
      wethToken.address,
      usdtToken.address,
      "ETH-USDT-LP"
    );
    await warpControl.createNewLPVault(
      0,
      ethDaiPair.address,
      wethToken.address,
      daiToken.address,
      "ETH-DAI-LP"
    );
    await warpControl.createNewLPVault(
      0,
      ethCPair.address,
      wethToken.address,
      usdcToken.address,
      "ETH-USDC-LP"
    );

    // Create Stable Coin Vaults
    await warpControl.createNewSCVault(
      0,
      "20000000000000000",
      "22222222222200000",
      "40",
      "900000000000000000",
      "1000000000000000000",
      "50000000000000000", //reserve factor for fees
      daiToken.address
    );
    await warpControl.createNewSCVault(
      0,
      "20000000000000000",
      "22222222222200000",
      "40",
      "900000000000000000",
      "1000000000000000000",
      "50000000000000000", //reserve factor for fees
      usdtToken.address
    );
    await warpControl.createNewSCVault(
      0,
      "20000000000000000",
      "22222222222200000",
      "40",
      "900000000000000000",
      "1000000000000000000",
      "50000000000000000", //reserve factor for fees
      usdcToken.address
    );

    await utils.increaseTime(ONE_DAY);

    const testerAddress = accounts[1];
    const testBorrow = accounts[0];
    const amount = 10000;
    const borrowAmount = 100;
    let amountLentExpected;
    let realBAmount;

    {
      const numDecimals = parseInt((await daiToken.decimals()).toString());
      const oneUnit = new BigNumber(10).pow(numDecimals);
      const realAmount = new BigNumber(amount).times(oneUnit);
      amountLentExpected = realAmount;
      await daiToken.mint(testerAddress, realAmount.toString());
       realBAmount = new BigNumber(borrowAmount).times(oneUnit);
    }

    const daiVault = await WarpVaultSC.at(await warpControl.instanceSCTracker(daiToken.address));
    await daiToken.approve(daiVault.address, amountLentExpected, {from: testerAddress});
    await daiVault.lendToWarpVault(amountLentExpected, {from: testerAddress});
    const ethBTCLPVault = await WarpVaultLP.at(await warpControl.instanceLPTracker(ethBtcPair.address));
    const lpBal = await ethBtcPair.balanceOf(testBorrow);
    await ethBtcPair.approve(ethBTCLPVault.address, lpBal, {from: testBorrow});
    await ethBTCLPVault.provideCollateral(await ethBtcPair.balanceOf(testBorrow));
    await warpControl.borrowSC(daiToken.address, realBAmount, {from: testBorrow});
    await daiVault.accrueInterest()
    const reserves = await daiVault.totalReserves();
    console.log(reserves.toString())
    const blocksInAYear = 6487 * 360;
    const reservesAsNumber = await parseFloat(web3.utils.fromWei(reserves))
    console.log(reservesAsNumber)
   const reservesAfterYear = reservesAsNumber * blocksInAYear;
   console.log(reservesAfterYear)


  });
});
