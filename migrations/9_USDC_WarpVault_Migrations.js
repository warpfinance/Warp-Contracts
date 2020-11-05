const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const WarpControl = artifacts.require("WarpControl");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");
const DAI = artifacts.require("DAI");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");
const WarpVault = artifacts.require("WarpVault");

const WBTC_WETH_ADD = "0xc6b091d62897b5e6877ec00da73ac3378b0fbc48";
const WETH_DAI_ADD = "0x02a12ab2a92437f4fc0d2f2b4643de3139d567c2";

module.exports = async (deployer) => {
  console.log("Creating USDC StableCoin Warp Vault");
  WarpC = await WarpControl.deployed();
  await WarpC.createNewSCVault(
    "1000000000000000000", //base rate per year(approx target base APR)
    "2000000000000000000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "2000000000000000000", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    4204800, //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    USDC.address,
    "US Dollar Coin",
    "USDC"
  );
  console.log("USDC StableCoin Warp Vault created successfully");
  console.log("Accessing Vault for setup");
  await WarpC.setupSCVault(USDC.address);
  console.log("USDC Warp Vault setup successful");
};
