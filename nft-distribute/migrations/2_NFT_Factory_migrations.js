const WarpNFTEpic = artifacts.require("WarpNFTEpic");
const WarpNFTLegendary = artifacts.require("WarpNFTLegendary");
const WarpNFTRare = artifacts.require("WarpNFTRare");
const WarpNFTSocial = artifacts.require("WarpNFTSocial");

module.exports = function(deployer) {
  deployer.deploy(WarpNFTEpic, "ipfs://");
  deployer.deploy(WarpNFTLegendary, "ipfs://");
  deployer.deploy(WarpNFTRare, "ipfs://");
  deployer.deploy(WarpNFTSocial, "ipfs://");
};
