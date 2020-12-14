const WarpNFTClaimControl = artifacts.require("WarpNFTClaimControl");
const WarpNFTFactory = artifacts.require("WarpNFTFactory");

module.exports = function(deployer) {
  const epicURI = "";
  const legendaryURI = "";
  const rareURI = "";
  const socialURI = "";
  deployer.deploy(
    WarpNFTClaimControl,
    WarpNFTFactory.address,
    epicURI,
    legendaryURI,
    rareURI,
    socialURI
  );
};
