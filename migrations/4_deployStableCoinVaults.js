const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const TetherToken = artifacts.require("TetherToken");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");

const WarpControl = artifacts.require("WarpControl");

// Existing tokens (for mainnet)
let daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
let usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
let wbtcAddress = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
let wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

module.exports = async (deployer, network, accounts) => {
  if (network.search("mainnet") == -1) {
    daiAddress = (await DAI.deployed()).address
    usdcAddress = (await USDC.deployed()).address;
    usdtAddress = (await TetherToken.deployed()).address;
    wbtcAddress = (await WrappedBitcoin.deployed()).address;
    wethAddress = (await WrappedEthereum.deployed()).address;
  }

  const target = Date.parse(require("./config.js").unlockDate);
  const now = new Date().getTime();
  let locktime = 0 //Math.floor((target - now) / 1000);

  if (locktime < 0) {
    locktime = 0;
  }

  const warpControl = await WarpControl.deployed();

  /* Create Stablecoin Vaults */
  console.log("Creating DAI StableCoin Warp Vault");
  receipt = await warpControl.createNewSCVault(
    locktime, //time lock
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000", //reserve factor for fees
    daiAddress
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("DAI StableCoin Warp Vault created successfully");

  console.log("Creating USDC StableCoin Warp Vault");
  receipt = await warpControl.createNewSCVault(
    locktime,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000", //reserve factor for fees
    usdcAddress
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("USDC StableCoin Warp Vault created successfully");

  console.log("Creating USDT StableCoin Warp Vault");
  receipt = await warpControl.createNewSCVault(
    locktime,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000", //reserve factor for fees
    usdtAddress
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("USDT StableCoin Warp Vault created successfully");

};
