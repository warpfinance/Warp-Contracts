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
  const inWei = toWei(amount.toString());
  await token.mint(account, inWei);
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
        dai: 1.0
      },
      eth: {
        btc: 34,
        usdt: 0.00247,
        usdc: 0.00247,
        dai: 0.00247
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
      "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41", //warp team fee address
      accounts[0]
    );
    // goodbye children, remember me...
    await oracleFactory.transferOwnership(warpControl.address);
    await lpFactory.transferOwnership(warpControl.address);
    await scFactory.transferOwnership(warpControl.address);

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
      ethCPair.address,
      wethToken.address,
      usdcToken.address,
      "ETH-USDC-LP"
    );

    // Create Stable Coin Vaults
    await warpControl.createNewSCVault(
      0,
      "1000000000000000000",
      "2000000000000000000",
      "2000000000000000000",
      4204800,
      "1000000000000000000",
      daiToken.address
    );
    await warpControl.createNewSCVault(
      0,
      "1000000000000000000",
      "2000000000000000000",
      "2000000000000000000",
      4204800,
      "1000000000000000000",
      usdtToken.address
    );
    await warpControl.createNewSCVault(
      0,
      "1000000000000000000",
      "2000000000000000000",
      "2000000000000000000",
      4204800,
      "1000000000000000000",
      usdcToken.address
    );

    await utils.increaseTime(ONE_DAY);

    await oracleFactory.getUnderlyingPrice(ethTPair.address);
    await oracleFactory.getUnderlyingPrice(ethDaiPair.address);
    await oracleFactory.getUnderlyingPrice(ethCPair.address);
    await oracleFactory.getUnderlyingPrice(ethBtcPair.address);

    await utils.increaseTime(ONE_DAY);

    // Test lending to vault
    const user1 = accounts[1];
    const daiInVault = 1000000;
    const usdcInVault = 1000000;
    const usdtInVault = 1000000;
    const ethBTCInVault = 10;
    const ethUsdcInVault = 10;
    const ethUsdtInVault = 10;
    const ethDaiInVault = 10;
    await daiToken.mint(user1, toWei(daiInVault.toString()));
    await usdcToken.mint(user1, toWei(usdcInVault.toString()));
    await usdtToken.mint(user1, toWei(usdtInVault.toString()));
    //pull in warp SC Vaults for use
    const daiWarpVault = await WarpVaultSC.at(
      await warpControl.instanceSCTracker(daiToken.address)
    );

    const usdcWarpVault = await WarpVaultSC.at(
      await warpControl.instanceSCTracker(usdcToken.address)
    );

    const usdtWarpVault = await WarpVaultSC.at(
      await warpControl.instanceSCTracker(usdtToken.address)
    );
    //approve and lend stablecoins to each vault
    ///dai
    await daiToken.approve(daiWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await daiWarpVault.lendToWarpVault(toWei(daiInVault.toString()), {
      from: user1
    });
    ///usdc
    await usdcToken.approve(usdcWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await usdcWarpVault.lendToWarpVault(toWei(usdcInVault.toString()), {
      from: user1
    });
    ///usdt
    await usdtToken.approve(usdtWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await usdtWarpVault.lendToWarpVault(toWei(usdtInVault.toString()), {
      from: user1
    });
    //pull in warp wrapper token for each and check for a 1:1 ratio with amount lent
    //dai
    const daiWarpWrapperToken = await WarpWrapperToken.at(
      await daiWarpVault.wStableCoin()
    );
    expect(fromWei(await daiWarpWrapperToken.balanceOf(user1))).equals(
      daiInVault.toString()
    );

<<<<<<< HEAD
    const usdcWarpWrapperToken = await WarpWrapperToken.at(
      await usdcWarpVault.wStableCoin()
    );
    expect(fromWei(await usdcWarpWrapperToken.balanceOf(user1))).equals(
      usdcInVault.toString()
    );

    const usdtWarpWrapperToken = await WarpWrapperToken.at(
      await usdtWarpVault.wStableCoin()
    );
    expect(fromWei(await usdtWarpWrapperToken.balanceOf(user1))).equals(
      usdtInVault.toString()
    );
    //get LP tokens for each pair for user 1
    await giveLPTokens(
      user1,
      ethDaiPair,
      wethToken,
      daiToken,
      conversionRates.eth.dai,
      1000
    );
    await giveLPTokens(
      user1,
      ethTPair,
      wethToken,
      usdtToken,
      conversionRates.eth.usdt,
      1000
    );
    await giveLPTokens(
      user1,
      ethBtcPair,
      wethToken,
      wbtcToken,
      conversionRates.eth.btc,
      1000
    );

    await giveLPTokens(
      user1,
      ethCPair,
      wethToken,
      usdcToken,
      conversionRates.eth.usdc,
      1000
    );
    //pull in LP vaults and lock up collateral in each
    //ETH-BTC pair
    const ethBTCWarpVault = await WarpVaultLP.at(
      await warpControl.instanceLPTracker(ethBtcPair.address)
    );
    await ethBtcPair.approve(ethBTCWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await ethBTCWarpVault.provideCollateral(toWei(ethBTCInVault.toString()), {
      from: user1
    });
    //ETH-USDC pair
    const ethUsdcWarpVault = await WarpVaultLP.at(
      await warpControl.instanceLPTracker(ethCPair.address)
    );
    await ethCPair.approve(ethUsdcWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await ethUsdcWarpVault.provideCollateral(toWei(ethUsdcInVault.toString()), {
      from: user1
    });
    //ETH-USDT pair
    const ethUsdtWarpVault = await WarpVaultLP.at(
      await warpControl.instanceLPTracker(ethTPair.address)
    );
    await ethTPair.approve(ethUsdtWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await ethUsdtWarpVault.provideCollateral(toWei(ethUsdtInVault.toString()), {
      from: user1
    });
    //ETH-DAI pair
    const ethDaiWarpVault = await WarpVaultLP.at(
      await warpControl.instanceLPTracker(ethDaiPair.address)
    );

    await ethDaiPair.approve(ethDaiWarpVault.address, toWei("1000000000000"), {
      from: user1
    });

    await ethDaiWarpVault.provideCollateral(toWei(ethDaiInVault.toString()), {
      from: user1
    });

    const testerAddress = "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41";
=======
    const testerAddress = "0x7f3A152F09324f2aee916CE069D3908603449173";
>>>>>>> 84b425fd82baba721e0b06e9b410e6f7393855c3
    await daiToken.mint(testerAddress, toWei("10000"));
    await usdcToken.mint(testerAddress, toWei("10000"));
    await usdtToken.mint(testerAddress, toWei("10000"));
    await giveLPTokens(
      testerAddress,
      ethDaiPair,
      wethToken,
      daiToken,
      conversionRates.eth.dai,
      1000
    );
    await giveLPTokens(
      testerAddress,
      ethTPair,
      wethToken,
      usdtToken,
      conversionRates.eth.usdt,
      1000
    );
    await giveLPTokens(
      testerAddress,
      ethBtcPair,
      wethToken,
      wbtcToken,
      conversionRates.eth.btc,
      1000
    );
    await giveLPTokens(
      testerAddress,
      ethCPair,
      wethToken,
      usdcToken,
      conversionRates.eth.usdc,
      1000
    );

    console.log("REACT_APP_LOCALHOST_DAI=" + daiToken.address);
    console.log("REACT_APP_LOCALHOST_USDC=" + usdcToken.address);
    console.log("REACT_APP_LOCALHOST_USDT=" + usdtToken.address);
    console.log("REACT_APP_LOCALHOST_ETH_DAI=" + ethDaiPair.address);
    console.log("REACT_APP_LOCALHOST_ETH_USDT=" + ethTPair.address);
    console.log("REACT_APP_LOCALHOST_ETH_USDC=" + ethCPair.address);
    console.log("REACT_APP_LOCALHOST_ETH_WBTC=" + ethBtcPair.address);
    console.log("REACT_APP_LOCALHOST_CONTROL=" + warpControl.address);
  });
});
