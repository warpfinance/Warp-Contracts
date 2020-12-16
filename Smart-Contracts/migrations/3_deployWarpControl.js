const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const TetherToken = artifacts.require("TetherToken");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");

const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpControl = artifacts.require("WarpControl");

// Existing tokens (for mainnet)
let daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
let usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
let wbtcAddress = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
let wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

module.exports = async (deployer, network, accounts) => {
  const warpTeam = "0x0EfE54e77e5Cc430342088DA27EF73f42B482D33";

  let uniswapFactory = undefined;
  let uniswapRouter = undefined;

  if (network.search("mainnet") >= 0) {
    uniswapFactory = await UniswapV2Factory.at(
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    );
    uniswapRouter = await UniswapV2Router02.at(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
  } else {
    daiAddress = (await DAI.deployed()).address
    usdcAddress = (await USDC.deployed()).address;
    usdtAddress = (await TetherToken.deployed()).address;
    wbtcAddress = (await WrappedBitcoin.deployed()).address;
    wethAddress = (await WrappedEthereum.deployed()).address;
    uniswapFactory = await UniswapV2Factory.deployed();
    uniswapRouter = await UniswapV2Router02.deployed();
  }

  const target = Date.parse('16 Dec 2020 17:50:00 UTC');
  let locktime = 0 //Math.floor((target - now) / 1000);

  if (locktime < 0) {
    locktime = 0;
  }

  /* Deploy Oracle Factory */
  const oracleFactory = await deployer.deploy(
    UniswapLPOracleFactory,
    usdcAddress,
    uniswapFactory.address,
    uniswapRouter.address
  );
  console.log("Uniswap LP token oracle contract deployed");


  /* Deploy Factories */
  const lpFactory = await deployer.deploy(WarpVaultLPFactory);
  console.log("Warp LP Vault factory contract deployed");
  const scFactory = await deployer.deploy(WarpVaultSCFactory);
  console.log("Warp StableCoin Vault factory contract deployed");

  /* Deploy Warp Control */
  console.log("reaching Warp Speed");
  const warpControl = await deployer.deploy(
    WarpControl,
    oracleFactory.address,
    lpFactory.address,
    scFactory.address,
    warpTeam
  );
  console.log("Warp Speed Controlled");

  /* Transfer ownership of oracle factory to Warp Control */
  let receipt = await oracleFactory.transferOwnership(warpControl.address);
  console.log(
    "Uniswap LP oracle contract factory ownership transfered to Warp Control"
  );

  const WETH_DAI_ADD = await uniswapFactory.getPair(wethAddress, daiAddress);
  const WBTC_WETH_ADD = await uniswapFactory.getPair(wethAddress, wbtcAddress);
  const WETH_USDT_ADD = await uniswapFactory.getPair(wethAddress, usdtAddress);
  const WETH_USDC_ADD = await uniswapFactory.getPair(wethAddress, usdcAddress);

  if (network == "development") {
    console.log("REACT_APP_LOCALHOST_ULPOF=" + UniswapLPOracleFactory.address);
    console.log("REACT_APP_LOCALHOST_DAI=" + daiAddress);
    console.log("REACT_APP_LOCALHOST_USDC=" + usdcAddress);
    console.log("REACT_APP_LOCALHOST_USDT=" + usdtAddress);
    console.log("REACT_APP_LOCALHOST_ETH_DAI=" + WETH_DAI_ADD);
    console.log("REACT_APP_LOCALHOST_ETH_USDT=" + WETH_USDT_ADD);
    console.log("REACT_APP_LOCALHOST_ETH_USDC=" + WETH_USDC_ADD);
    console.log("REACT_APP_LOCALHOST_ETH_WBTC=" + WBTC_WETH_ADD);
    console.log("REACT_APP_LOCALHOST_CONTROL=" + warpControl.address);
  } else if (network == "kovan") {
    console.log("kovan ULPOF = " + UniswapLPOracleFactory.address);
    console.log("kovan DAI = " + daiAddress);
    console.log("kovan USDC = " + usdcAddress);
    console.log("kovan USDT = " + usdtAddress);
    console.log("kovan ETH_DAI = " + WETH_DAI_ADD);
    console.log("kovan ETH_USDT = " + WETH_USDT_ADD);
    console.log("kovan ETH_USDC = " + WETH_USDC_ADD);
    console.log("kovan ETH_WBTC = " + WBTC_WETH_ADD);
    console.log("kovan CONTROL = " + warpControl.address);
  } else if (network == "mainnet") {
    console.log("mainnet ULPOF = " + UniswapLPOracleFactory.address);
    console.log("mainnet DAI = " + daiAddress);
    console.log("mainnet USDC = " + usdcAddress);
    console.log("mainnet USDT = " + usdtAddress);
    console.log("mainnet ETH_DAI = " + WETH_DAI_ADD);
    console.log("mainnet ETH_USDT = " + WETH_USDT_ADD);
    console.log("mainnet ETH_USDC = " + WETH_USDC_ADD);
    console.log("mainnet ETH_WBTC = " + WBTC_WETH_ADD);
    console.log("mainnet CONTROL = " + warpControl.address);
  }

};
