const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const TetherToken = artifacts.require("TetherToken");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");

const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const WarpControl = artifacts.require("WarpControl");

// Existing tokens (for mainnet)
let daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
let usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
let wbtcAddress = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
let wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

module.exports = async (deployer, network, accounts) => {
  let uniswapFactory = undefined;

  if (network.search("mainnet") >= 0) {
    uniswapFactory = await UniswapV2Factory.at(
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    );
  } else {
    daiAddress = (await DAI.deployed()).address
    usdcAddress = (await USDC.deployed()).address;
    usdtAddress = (await TetherToken.deployed()).address;
    wbtcAddress = (await WrappedBitcoin.deployed()).address;
    wethAddress = (await WrappedEthereum.deployed()).address;
    uniswapFactory = await UniswapV2Factory.deployed();
  }

  const warpControl = await WarpControl.deployed();

  const target = Date.parse(require("./config.js").unlockDate);
  const now = new Date().getTime();
  let locktime = 0 //Math.floor((target - now) / 1000);

  if (locktime < 0) {
    locktime = 0;
  }

  /* get pairs */

  const WETH_DAI_ADD = await uniswapFactory.getPair(wethAddress, daiAddress);
  const WBTC_WETH_ADD = await uniswapFactory.getPair(wethAddress, wbtcAddress);
  const WETH_USDT_ADD = await uniswapFactory.getPair(wethAddress, usdtAddress);
  const WETH_USDC_ADD = await uniswapFactory.getPair(wethAddress, usdcAddress);


  /* Create LP Vaults */
  console.log("Creating WETH-DAI Warp Vault");
  let receipt = await warpControl.createNewLPVault(
    locktime, //time lock
    WETH_DAI_ADD,
    wethAddress,
    daiAddress,
    "WETH-DAI"
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("WETH-DAI Vault setup successful");

  console.log("Creating WBTC-WETH Warp Vault");
  receipt = await warpControl.createNewLPVault(
    locktime, //time lock
    WBTC_WETH_ADD,
    wbtcAddress,
    wethAddress,
    "WBTC-WETH"
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("WBTC-WETH Vault setup successful");

  console.log("Creating USDT-WETH Warp Vault");
  receipt = await warpControl.createNewLPVault(
    locktime, //time lock
    WETH_USDT_ADD,
    usdtAddress,
    wethAddress,
    "USDT-WETH"
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("USDT-WETH Vault setup successful");

  console.log("Creating USDC-WETH Warp Vault");
  receipt = await warpControl.createNewLPVault(
    locktime, //time lock
    WETH_USDC_ADD,
    usdcAddress,
    wethAddress,
    "USDC-WETH"
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("USDC-WETH Vault setup successful");
  await warpControl.transferOwnership("0x0EfE54e77e5Cc430342088DA27EF73f42B482D33");
};
