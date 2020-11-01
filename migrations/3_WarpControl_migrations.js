const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const WarpControl = artifacts.require("WarpControl");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");
const DAI = artifacts.require("DAI");

module.exports = async deployer => {
  console.log("reaching Warp Speed");
  await deployer.deploy(
    WarpControl,
    UniswapLPOracleFactory.address,
    DAI.address,
    USDC.address,
    USDT.address
  );
  console.log("Warp Speed Controlled");
  UOF = await UniswapLPOracleFactory.deployed();
  await UOF.transferOwnership(WarpControl.address);
  console.log(
    "Uniswap LP oracle contract factory ownership transfered to Warp Control"
  );
};
