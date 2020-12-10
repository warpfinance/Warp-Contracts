const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const WrappedBitcoin = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
const WrappedEthereum = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpControl = artifacts.require("WarpControl");

const oldControlAddress = "0xcc8d17feeb20969523f096797c3d5c4a490ed9a8";

const expectedLPFactory = "0xa74838f2237DEE55fd72A5f69C6eFC08E1248Fe3";
const expectedOracleFactory = "0xFf426Bb249C53282C6Ef6F1973B07F175362e0e8";

const DAIVault = "0x31Cd9B3525946B521B01FaB324B0aa1807A078a2";
const USDCVault = "0x2BE5e4E7711ccC1c665b718AB2D22aA11307638e";
const ecPairVault = "0xaB3442Be99d4F291234437769EDE690f39a24851";
const etPairVault = "0x84be8517AA1Ac3027b89A83e64B8C039C71B9176";
const ebPairVault = "0x22A9fb8704bc2B89CdAf0E0Bac0B8fd5Ae7cD98d";
const edPairVault = "0x500D083a118A23b805332BF4F8Be57257d9C70Be";

module.exports = async (deployer, network, accounts) => {
  const feeAddress = "0x95947E1c378cF978f2A4038AdD5d6f1682F34f58"

  const now = new Date().getTime();
  const target = new Date.parse('16 Dec 2020 17:50:00 UTC');
  let locktime = Math.floor((target - now) / 1000);
  console.log("calculated lock time as " + target);
  if (locktime < 0) {
    console.error("locktime < 0");
    return;
  }

  let receipt = undefined;

  const WETH_DAI_ADD = await UNI.getPair(WrappedEthereum, DAI);
  const WBTC_WETH_ADD = await UNI.getPair(WrappedEthereum, WrappedBitcoin);
  const WETH_USDT_ADD = await UNI.getPair(WrappedEthereum, USDT);
  const WETH_USDC_ADD = await UNI.getPair(WrappedEthereum, USDC);

  const oldControl = await WarpControl.at(oldControlAddress);
  const oldLPFactory = await oldControl.WVLPF();
  const oldOracleFactory = await oldControl.Oracle();

  console.log(`Working with old control at ${oldControlAddress}`);
  console.log(`Found old LP Factory as ${oldLPFactory}`);
  console.log(`Found old Oracle Factory as ${oldOracleFactory}`);

  if (oldLPFactory.address != expectedLPFactory) {
    console.error("Mismatched LP Factory");
    return;
  }

  if (oldOracleFactory.address != expectedOracleFactory) {
    console.error("Mismatched Oracle factory");
    return;
  }

  assert(await oldControl.instanceLPTracker(WETH_DAI_ADD) != edPairVault);
  assert(await oldControl.instanceLPTracker(WETH_USDC_ADD) != ecPairVault);
  assert(await oldControl.instanceLPTracker(WETH_USDT_ADD) != etPairVault);
  assert(await oldControl.instanceLPTracker(WBTC_WETH_ADD) != ebPairVault);

  assert(await oldControl.instanceSCTracker(DAI) != DAIVault);
  assert(await oldControl.instanceSCTracker(USDC) != USDCVault);


  const UNI = await UniswapV2Factory.at(
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  );
  const UNI_R = await UniswapV2Router02.at(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  );
  
  console.log("Deploying stable coin factory");
  await deployer.deploy(WarpVaultSCFactory);
  console.log("Warp StableCoin Vault factory contract deployed");

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("reaching Warp Speed");
  await deployer.deploy(
    WarpControl,
    oldOracleFactory,
    oldLPFactory,
    WarpVaultSCFactory.address,
    feeAddress,
    oldControl
  );
  console.log("Warp Speed Controlled");

  WVSC = await WarpVaultSCFactory.deployed();
  await WVSC.transferOwnership(WarpControl.address);
  console.log(
    "Warp Vault StableCoin contract factory ownership transfered to Warp Control"
  );


  console.log("importing lp vaults");

  await WarpControl.importLPVault(ecPairVault);
  await WarpControl.importLPVault(edPairVault);
  await WarpControl.importLPVault(etPairVault);
  await WarpControl.importLPVault(ebPairVault);

  console.log("importing sc vaults");

  await WarpControl.importSCVault(DAIVault);
  await WarpControl.importSCVault(USDCVault);
  
  console.log("Creating USDT StableCoin Warp Vault");
  receipt = await WarpC.createNewSCVault(
    locktime,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000", //reserve factor for fees
    USDT
  );
  console.log(`Gas used: ${receipt.receipt.gasUsed}`);
  console.log("USDT StableCoin Warp Vault created successfully");

  console.log("New Control: " + WarpControl.address);

};
