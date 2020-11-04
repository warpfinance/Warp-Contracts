const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");

module.exports = async (deployer) => {
  await deployer.deploy(WarpVaultLPFactory);
  console.log("Warp LP Vault factory contract deployed");
};
