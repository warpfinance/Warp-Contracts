const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const WarpControl = artifacts.require("WarpControl");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");
const DAI = artifacts.require("DAI");

module.exports = async (deployer) => {
  console.log("reaching Warp Speed");
  await deployer.deploy(
    WarpControl,
    UniswapLPOracleFactory.address,
    WarpVaultLPFactory.address,
    WarpVaultSCFactory.address
  );
  console.log("Warp Speed Controlled");
  UOF = await UniswapLPOracleFactory.deployed();
  await UOF.transferOwnership(WarpControl.address);
  console.log(
    "Uniswap LP oracle contract factory ownership transfered to Warp Control"
  );
  WVLP = await WarpVaultLPFactory.deployed();
  await WVLP.transferOwnership(WarpControl.address);
  console.log(
    "Warp Vault LP contract factory ownership transfered to Warp Control"
  );
  WVSC = await WarpVaultSCFactory.deployed();
  await WVSC.transferOwnership(WarpControl.address);
  console.log(
    "Warp Vault StableCoin contract factory ownership transfered to Warp Control"
  );
};
