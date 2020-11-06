const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const USDC = artifacts.require("USDC");

module.exports = async (deployer) => {
  await deployer.deploy(
    UniswapLPOracleFactory,
    USDC.address,
    "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f",
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  );
  console.log("Uniswap LP token oracle contract deployed");
};
