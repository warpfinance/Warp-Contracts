const WarpNFTFactory = artifacts.require("WarpNFTFactory");

module.exports = function(deployer) {
  deployer.deploy(WarpNFTFactory, "ipfs://");
};
