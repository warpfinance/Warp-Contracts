const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");

module.exports = async (deployer) => {
  await deployer.deploy(WarpVaultLPFactory);
  console.log("Warp LP Vault factory contract deployed");
  await deployer.deploy(WarpVaultSCFactory);
  console.log("Warp StableCoin Vault factory contract deployed");
};
