const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const USDT = artifacts.require("USDT");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");
const UniswapLPOracleFactory = artifacts.require("UniswapLPOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WarpVaultSCFactory = artifacts.require("WarpVaultSCFactory");
const WarpVaultLPFactory = artifacts.require("WarpVaultLPFactory");
const WarpControl = artifacts.require("WarpControl");

module.exports = async deployer => {
  console.log("Initiate the Token Canon...");
  await deployer.deploy(DAI);
  console.log("Deploying the DAI....");
  await deployer.deploy(USDC);
  console.log("Tokenizing the US Dollar....");
  await deployer.deploy(USDT);
  console.log("Inflating the US dollar.....");
  await deployer.deploy(WrappedBitcoin);
  console.log("Making Bitcoin usable.....");
  await deployer.deploy(WrappedEthereum);
  console.log("Wrapping the Ethereum.......");
  console.log("Deploying the UniSwapper...");
  await deployer.deploy(
    UniswapV2Factory,
    "0xEAf8DaEfE55Fa2268775a06B43847a7f48D98720"
  );
  console.log("UniSwap Deployed");
  console.log("Deploying the UniSwap Router...");
  await deployer.deploy(
    UniswapV2Router02,
    UniswapV2Factory.address,
    WrappedEthereum.address
  );
  console.log("UniSwap Router Deployed");
  const UNI = await UniswapV2Factory.deployed();
  const UNI_R = await UniswapV2Router02.deployed();

  const usdc = await USDC.deployed();
  const dai = await DAI.deployed();
  const usdt = await USDT.deployed();
  const wbtc = await WrappedBitcoin.deployed();
  const weth = await WrappedEthereum.deployed();
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wBTC");
  await UNI.createPair(USDC.address, WrappedBitcoin.address);
  const USDC_wBTC = await UNI.getPair(USDC.address, WrappedBitcoin.address);
  console.log("USDC-wBTC pair created");
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await wbtc.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    wbtc.address,
    "1400000000000000000000", //$14,000 USDC
    "1000000000000000000", // 1 BTC
    "1300000000000000000000", // $13,000 USDC
    "900000000000000000", //0.9 BTC
    USDC_wBTC,
    100000000000000
  );
  console.log("Liquidity is now Liquid!");
  console.log("Listed USDC-wBTC");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wETH");
  //  await UNI.createPair(USDC.address, WrappedEthereum.address);
  const USDC_wETH = await UNI.getPair(USDC.address, WrappedEthereum.address);
  console.log("USDC-wETH pair created");
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    weth.address,
    "40000000000000000000", //$400 USDC
    "1000000000000000000", // 1 ETH
    "300000000000000", //$300 USDC
    "900000000000000", // 0.9 ETH
    USDC_wETH,
    100000000000000
  );
  console.log("Listed USDC-wETH");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-DAI");
  await UNI.createPair(USDC.address, DAI.address);
  const USDC_DAI = await UNI.getPair(USDC.address, DAI.address);
  console.log("USDC-DAI pair created");
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await dai.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    dai.address,
    "1000000000000000001", //1-1 ish
    "1000000000000000000",
    "900000000000000000",
    "900000000000000001",
    USDC_DAI,
    100000000000000
  );
  console.log("Listed USDC-DAI");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-USDT");
  await UNI.createPair(USDC.address, USDT.address);
  const USDC_USDT = await UNI.getPair(USDC.address, USDT.address);
  console.log("USDC-USDT pair created");
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await usdt.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    usdt.address,
    "1000000000000000001", //1-1 ish
    "1000000000000000000",
    "900000000000000000",
    "900000000000000001",
    USDC_USDT,
    100000000000000
  );
  console.log("Listed USDC-USDT");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing ETH-wBTC");
  await UNI.createPair(WrappedEthereum.address, WrappedBitcoin.address);
  const ETH_wBTC = await UNI.getPair(
    WrappedEthereum.address,
    WrappedBitcoin.address
  );
  console.log("ETH-wBTC pair created");
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  await wbtc.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    weth.address,
    wbtc.address,
    "35000000000000000000",
    "1000000000000000000",
    "34000000000000000000",
    "900000000000000000",
    ETH_wBTC,
    100000000000000
  );
  console.log("Listed ETH-wBTC");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing ETH-DAI");
  await UNI.createPair(WrappedEthereum.address, DAI.address);
  const ETH_DAI = await UNI.getPair(WrappedEthereum.address, DAI.address);
  console.log("ETH-DAI pair created");
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  await dai.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    weth.address,
    dai.address,
    "35000000000000000000",
    "1000000000000000000",
    "34000000000000000000",
    "900000000000000000",
    ETH_DAI,
    100000000000000
  );
  console.log("Listed ETH-DAI");
  ////////////////////////////////////////////////////////////////////////////////////////////
  await deployer.deploy(
    UniswapLPOracleFactory,
    USDC.address,
    UNI.address,
    UNI_R.address
  );
  console.log("Uniswap LP token oracle contract deployed");
  ////////////////////////////////////////////////////////////////////////////////////////////
  await deployer.deploy(WarpVaultLPFactory);
  console.log("Warp LP Vault factory contract deployed");
  await deployer.deploy(WarpVaultSCFactory);
  console.log("Warp StableCoin Vault factory contract deployed");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("reaching Warp Speed");
  await deployer.deploy(
    WarpControl,
    UniswapLPOracleFactory.address,
    WarpVaultLPFactory.address,
    WarpVaultSCFactory.address,
    "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41" //warp team address
  );
  console.log("Warp Speed Controlled");
  UOF = await UniswapLPOracleFactory.deployed();
  await UOF.transferOwnership(WarpControl.address);
  console.log(
    "Uniswap LP oracle contract factory ownership transfered to Warp Control"
  );
  WVLP = await WarpVaultLPFactory.deployed();
  await WVLP.transferOwnership(WarpControl.address);
  console.log(
    "Warp Vault LP contract factory ownership transfered to Warp Control"
  );
  WVSC = await WarpVaultSCFactory.deployed();
  await WVSC.transferOwnership(WarpControl.address);
  console.log(
    "Warp Vault StableCoin contract factory ownership transfered to Warp Control"
  );
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Creating WETH-DAI Warp Vault");
  const WarpC = await WarpControl.deployed();
  const WBTC_WETH_ADD = await UNI.getPair(
    WrappedEthereum.address,
    WrappedBitcoin.address
  );
  const WETH_DAI_ADD = await UNI.getPair(WrappedEthereum.address, DAI.address);
  await WarpC.createNewLPVault(
    0,
    WETH_DAI_ADD,
    WrappedEthereum.address,
    DAI.address,
    "WETH-DAI"
  );
  console.log("WETH-DAI Vault setup successful");
  console.log("Creating WBTC-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0,
    WBTC_WETH_ADD,
    WrappedBitcoin.address,
    WrappedEthereum.address,
    "WBTC-WETH"
  );
  console.log("WBTC-WETH Vault setup successful");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Creating DAI StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "1000000000000000000", //base rate per year(approx target base APR)
    "2000000000000000000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "2000000000000000000", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    4204800, //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    DAI.address
  );
  console.log("DAI StableCoin Warp Vault created successfully");
  /////////////////////////////////////////////////////////////////////////
  console.log("Creating USDC StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "1000000000000000000", //base rate per year(approx target base APR)
    "2000000000000000000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "2000000000000000000", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    4204800, //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    USDC.address
  );
  console.log("USDC StableCoin Warp Vault created successfully");
  /////////////////////////////////////////////////////////////////////////
  console.log("Creating USDT StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "1000000000000000000", //base rate per year(approx target base APR)
    "2000000000000000000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "2000000000000000000", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    4204800, //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    USDT.address
  );
  console.log("USDT StableCoin Warp Vault created successfully");
};
////////////////////////////////////////////////////////////////////////////////////////////
