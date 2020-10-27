const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");

module.exports = function(deployer) {
  console.log("Initiate the Token Canon...");
  deployer.deploy(DAI);
  console.log("Deploying the DAI....");
  deployer.deploy(USDC);
  console.log("Tokenizing the US Dollar....");
  deployer.deploy(USDT);
  console.log("inflating the US dollar.....");
  deployer.deploy(WrappedBitcoin);
  console.log("Making Bitcoin usable.....");
  deployer.deploy(WrappedEthereum);
  console.log("Wrapping the Ethereum.......");
};
