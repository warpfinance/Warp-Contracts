const WarpNFTEpic = artifacts.require("WarpNFTEpic");
const WarpNFTLegendary = artifacts.require("WarpNFTLegendary");
const WarpNFTRare = artifacts.require("WarpNFTRare");
const WarpNFTSocial = artifacts.require("WarpNFTSocial");
const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");


module.exports = async function(deployer) {
let epicHash;
let legendaryHash;
let rareHash;
let socialHash;

console.log("hashing epically")
await (async () => {
  const doc = JSON.stringify({
    "description": "Epic - 75% TVL boost for Warp Finance's Team Competition.",
    "external_url": "https://warp.finance",
    "image": "https://ipfs.io/ipfs/QmWNrzuwsffysBQMKiPqWo8fkx6vBuMgAamoP568q2ozaV",
    "name": "Warp Epic NFT",
    "artist": "MadeByAnimus",
  });
  const cid = await ipfs.add(doc);
  console.log("Epic IPFS cid:", cid);
  console.log(await ipfs.cat(cid));
  epicHash = cid;
})();

console.log("legendary hashing")
await (async () => {
  const doc = JSON.stringify({
    "description": "Legendary - 150% TVL boost for Warp Finance's Team competition.",
    "external_url": "https://warp.finance",
    "image": "https://ipfs.io/ipfs/QmaXoTMCJBVPDTxP5Ehqs1n2EdQDH15fSEbKEGCsf8fg5W",
    "name": "Warp Legendary NFT",
    "artist": "MadeByAnimus",
  });
  const cid = await ipfs.add(doc);
  console.log("Legendary IPFS cid:", cid);
  console.log(await ipfs.cat(cid));
  legendaryHash = cid;
})();

console.log("obtaining the rarest of hashes")
await (async () => {
  const doc = JSON.stringify({
    "description": "15% TVL boost for Warp Finance's Team competition.",
    "external_url": "https://warp.finance",
    "image": "https://ipfs.io/ipfs/QmUNuRMv3KWoX2P9aJquQykTDfT5VqLF3GKFDmn4gxDrQT",
    "name": "Warp Rare NFT",
    "artist": "MadeByAnimus",
  });
  const cid = await ipfs.add(doc);
  console.log("Rare IPFS cid:", cid);
  console.log(await ipfs.cat(cid));
  rareHash = cid;
})();

console.log("hashing socially on the weekends")
await (async () => {
  const doc = JSON.stringify({
    "description": "Social NFT - Rewarded for participating in Warp Finance's Solo Explorer Campaign ",
    "external_url": "https://warp.finance",
    "image": "https://ipfs.io/ipfs/Qman98Ukaw81pqsfdR26fHyc9jjxMmecjSvNvjB2XMbfs1",
    "name": "Warp Social NFT",
    "artist": "MadeByAnimus",
  });
  const cid = await ipfs.add(doc);
  console.log("Social IPFS cid:", cid);
  console.log(await ipfs.cat(cid));
  socialHash = cid;
})();

const epicURI = "https://ipfs.io/ipfs/" + epicHash;
const legendaryURI = "https://ipfs.io/ipfs/" + legendaryHash;
const rareURI = "https://ipfs.io/ipfs/" + rareHash;
const socialURI = "https://ipfs.io/ipfs/" + socialHash;

console.log("epic url: " + epicURI);
  await deployer.deploy(WarpNFTEpic, epicURI);
  await deployer.deploy(WarpNFTLegendary, legendaryURI);
  await deployer.deploy(WarpNFTRare, rareURI);
  await deployer.deploy(WarpNFTSocial, socialURI);
  console.log("Tokens are now Fungible!")
};
