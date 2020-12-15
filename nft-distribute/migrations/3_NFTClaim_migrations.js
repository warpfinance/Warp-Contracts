const WarpNFTClaimControl = artifacts.require("WarpNFTClaimControl");
const WarpNFTEpic = artifacts.require("WarpNFTEpic");
const WarpNFTLegendary = artifacts.require("WarpNFTLegendary");
const WarpNFTRare = artifacts.require("WarpNFTRare");
const WarpNFTSocial = artifacts.require("WarpNFTSocial");

module.exports = async function(deployer) {
  await deployer.deploy(
    WarpNFTClaimControl,
    WarpNFTEpic.address,
    WarpNFTLegendary.address,
    WarpNFTRare.address,
    WarpNFTSocial.address
  );


};
