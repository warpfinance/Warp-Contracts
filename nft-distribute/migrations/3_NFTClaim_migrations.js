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

  Wepic = await WarpNFTEpic.deployed();
  Wlegendary = await WarpNFTLegendary.deployed();
  Wrare = await WarpNFTRare.deployed();
  Wsocial = await WarpNFTSocial.deployed();

  await Wepic.transferOwnership(WarpNFTClaimControl.address);
  await Wlegendary.transferOwnership(WarpNFTClaimControl.address);
  await Wrare.transferOwnership(WarpNFTClaimControl.address);
  await Wsocial.transferOwnership(WarpNFTClaimControl.address);

  console.log("Warp NFT Claim Control address: " + WarpNFTClaimControl.address)
  console.log("Warp Epic NFT address: " + WarpNFTEpic.address)
  console.log("Warp Legendary NFT address: " + WarpNFTLegendary.address)
  console.log("Warp Rare NFT address: " + WarpNFTRare.address)
  console.log("Warp Social NFT address: " + WarpNFTSocial.address)
  
};
