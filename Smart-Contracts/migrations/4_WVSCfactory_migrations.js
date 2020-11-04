const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");

module.exports = async (deployer) => {
  await deployer.deploy(WarpVaultSCFactory);
  console.log("Warp StableCoin Vault factory contract deployed");
};
