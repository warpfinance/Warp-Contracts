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


  Wclaim = await WarpNFTClaimControl.deployed();
  Wepic = await WarpNFTEpic.deployed();
  Wlegendary = await WarpNFTLegendary.deployed();
  Wrare = await WarpNFTRare.deployed();
  Wsocial = await WarpNFTSocial.deployed();
  let legendaryWinners = [0x78380713061502cc21c0A8c93555c0b4aa37602e, 0x10629DBFF087fC9A209bB23AadFA02e174c28002];
  let epicWinners = [0x3aF547f909f145fe2d8E8f66365FD89f0005a332];
  let rareWinners = [0x5070eC10E302eDc1B1bEa7a85818bbFe29BcDacE, 0x30BFE728Bc9fd79A6a047134c23D5de0C41FEa4d];
  let socialWinners = [0x10629DBFF087fC9A209bB23AadFA02e174c28002, 0x30BFE728Bc9fd79A6a047134c23D5de0C41FEa4d, 0x00F665D2cFf2DDB79bB370120480CF9ef334bc97];


  await Wepic.transferOwnership(WarpNFTClaimControl.address);
  await Wlegendary.transferOwnership(WarpNFTClaimControl.address);
  await Wrare.transferOwnership(WarpNFTClaimControl.address);
  await Wsocial.transferOwnership(WarpNFTClaimControl.address);
  await Wclaim.epicWhiteLister(epicWinners);
  await Wclaim.legendaryWhiteLister(legendaryWinners);
  await Wclaim.rareWhiteLister(rareWinners);
  await Wclaim.socialWhiteLister(socialWinners);



  console.log("Warp NFT Claim Control address: " + WarpNFTClaimControl.address)
  console.log("Warp Epic NFT address: " + WarpNFTEpic.address)
  console.log("Warp Legendary NFT address: " + WarpNFTLegendary.address)
  console.log("Warp Rare NFT address: " + WarpNFTRare.address)
  console.log("Warp Social NFT address: " + WarpNFTSocial.address)

};
