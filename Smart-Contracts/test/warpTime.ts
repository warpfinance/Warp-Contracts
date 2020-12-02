const truffleAssert = require("truffle-assertions");
const w3 = require("web3");
const utils = require("./utils.js");
const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const toWei = w3.utils.toWei;
const fromWei = w3.utils.fromWei;

const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WarpControl = artifacts.require("WarpControl");
const WarpVaultLP = artifacts.require("WarpVaultLP");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpVaultSC = artifacts.require("WarpVaultSC");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const UniswapLPOracleInstance = artifacts.require("UniswapLPOracleInstance");
const WarpWrapperToken = artifacts.require("WarpWrapperToken");
const ERC20 = artifacts.require("ERC20");
const TestToken = artifacts.require("TesterToken");

const ONE_DAY = 1000 * 86400;

contract("Warp Time", function(accounts) {
  it("warp", async () => {
    const controlAddress = "0xf5fE15b388Ac86499c1109c652FF70c31A0E5bD9";

    {
      const warpControl = await WarpControl.at(controlAddress);
      for (let i = 0; i < 3; ++i) {
        const vaultAddress = await await warpControl.scVaults(i);
        const vault = await WarpVaultSC.at(vaultAddress);
        await vault.accrueInterest();
      }   
    }
    
    const numWeeks = 500000;
    for (let week = 0; week < numWeeks; ++week) {
      await utils.advanceBlock();
      const warpControl = await WarpControl.at(controlAddress);
      const numVaults = parseInt((await warpControl.viewNumSCVaults).toString())
      for (let i = 0; i < numVaults; ++i) {
        const vaultAddress = await await warpControl.scVaults(i);
        const vault = await WarpVaultSC.at(vaultAddress);
        await vault.accrueInterest();
      }      
    }

    
  });
});
