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
  console.log("Creating WETH-DAI Warp Vault");

  WarpC = await WarpControl.deployed();
  await WarpC.createNewLPVault(
    WETH_DAI_ADD,
    WrappedEthereum.address,
    DAI.address,
    "WETH-DAI"
  );
  console.log("WETH-DAI Vault setup successful");
};
