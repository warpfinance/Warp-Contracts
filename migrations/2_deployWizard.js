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

const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const amountWithDecimals = (amount, decimals) => {
  const oneUnit = new BigNumber(10).pow(decimals);
  const realAmount = new BigNumber(amount).times(oneUnit).toString();
  return realAmount;
};

const parseBigNumber = (big, decimals) => {
  if (decimals) {
    big = new BigNumber(big.toString()).div(new BigNumber("1e" + decimals));
  } else {
    big = new BigNumber(big.toString());
  }
  const asJSNumber = big.toNumber();
  return asJSNumber;
};

module.exports = async (deployer, network) => {
  const ownerAddress = "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41";

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

  const usdcDecimals = parseBigNumber(await usdc.decimals());
  const daiDecimals = parseBigNumber(await dai.decimals());
  const usdtDecimals = parseBigNumber(await usdt.decimals());
  const wbtcDecimals = parseBigNumber(await wbtc.decimals());
  const wethDecimals = parseBigNumber(await weth.decimals());
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wETH");
  await UNI.createPair(USDC.address, WrappedEthereum.address);
  const USDC_wETH = await UNI.getPair(USDC.address, WrappedEthereum.address);
  console.log("USDC-wETH pair created");
  console.log(USDC_wETH);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    weth.address,
    amountWithDecimals(400 * 10000, usdcDecimals), //$400 USDC
    amountWithDecimals(1 * 10000, wethDecimals), // 1 ETH
    "0", //$300 USDC
    "0", // 0.9 ETH
    ownerAddress,
    100000000000000
  );
  const pair1 = await UniswapV2Pair.at(USDC_wETH);
  pair1.sync();
  console.log("Listed USDC-wETH");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wBTC");
  await UNI.createPair(USDC.address, WrappedBitcoin.address);
  const USDC_wBTC = await UNI.getPair(USDC.address, WrappedBitcoin.address);
  console.log("USDC-wBTC pair created");
  console.log(USDC_wBTC);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await wbtc.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    wbtc.address,
    amountWithDecimals(14000, usdcDecimals), //$14,000 USDC
    amountWithDecimals(1, wbtcDecimals), // 1 BTC
    "0", // $13,000 USDC
    "0", //0.9 BTC
    ownerAddress,
    100000000000000
  );
  const pair2 = await UniswapV2Pair.at(USDC_wBTC);
  pair2.sync();
  console.log("Liquidity is now Liquid!");
  console.log("Listed USDC-wBTC");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-DAI");
  await UNI.createPair(USDC.address, DAI.address);
  const USDC_DAI = await UNI.getPair(USDC.address, DAI.address);
  console.log("USDC-DAI pair created");
  console.log(USDC_DAI);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await dai.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    dai.address,
    amountWithDecimals(100000, usdcDecimals), //1-1 ish
    amountWithDecimals(100001, daiDecimals),
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair3 = await UniswapV2Pair.at(USDC_DAI);
  pair3.sync();
  console.log("Listed USDC-DAI");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-USDT");
  await UNI.createPair(USDC.address, USDT.address);
  const USDC_USDT = await UNI.getPair(USDC.address, USDT.address);
  console.log("USDC-USDT pair created");
  console.log(USDC_USDT);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await usdt.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    usdt.address,
    amountWithDecimals(100000, usdcDecimals), //1-1 ish
    amountWithDecimals(100000, usdtDecimals),
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair4 = await UniswapV2Pair.at(USDC_USDT);
  pair4.sync();
  console.log("Listed USDC-USDT");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing ETH-wBTC");
  await UNI.createPair(WrappedEthereum.address, WrappedBitcoin.address);
  const ETH_wBTC = await UNI.getPair(
    WrappedEthereum.address,
    WrappedBitcoin.address
  );
  console.log("ETH-wBTC pair created");
  console.log(ETH_wBTC);

  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  await wbtc.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    weth.address,
    wbtc.address,
    amountWithDecimals(35 * 10000, wethDecimals), //35 eth
    amountWithDecimals(1 * 10000, wbtcDecimals), //one btc
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair5 = await UniswapV2Pair.at(ETH_wBTC);
  pair5.sync();
  console.log("Listed ETH-wBTC");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing ETH-USDT");
  await UNI.createPair(WrappedEthereum.address, USDT.address);
  const ETH_USDT = await UNI.getPair(WrappedEthereum.address, USDT.address);
  console.log("ETH-USDT pair created");
  console.log(ETH_USDT);

  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  await dai.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdt.address,
    weth.address,
    amountWithDecimals(400 * 10000, usdcDecimals), //$400 USDT
    amountWithDecimals(1 * 10000, wethDecimals), // 1 ETH
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair6 = await UniswapV2Pair.at(ETH_USDT);
  pair6.sync();
  console.log("Listed ETH-USDT");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing ETH-DAI");
  await UNI.createPair(WrappedEthereum.address, DAI.address);
  const ETH_DAI = await UNI.getPair(WrappedEthereum.address, DAI.address);
  console.log("ETH-DAI pair created");
  console.log(ETH_DAI);
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  await dai.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    dai.address,
    weth.address,
    amountWithDecimals(400 * 10000, daiDecimals), //$400 DAI
    amountWithDecimals(1 * 10000, wethDecimals), // 1 ETH
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair7 = await UniswapV2Pair.at(ETH_DAI);
  pair7.sync();
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
    ownerAddress //warp team address
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
  const WETH_DAI_ADD = await UNI.getPair(WrappedEthereum.address, DAI.address);
  const WBTC_WETH_ADD = await UNI.getPair(
    WrappedEthereum.address,
    WrappedBitcoin.address
  );
  const WETH_USDT_ADD = await UNI.getPair(
    WrappedEthereum.address,
    USDT.address
  );
  const WETH_USDC_ADD = await UNI.getPair(
    WrappedEthereum.address,
    USDC.address
  );

  ///////////////////////////pairs retrieved///////////
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
  console.log("Creating USDT-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0,
    WETH_USDT_ADD,
    USDT.address,
    WrappedEthereum.address,
    "USDT-WETH"
  );
  console.log("USDT-WETH Vault setup successful");
  console.log("Creating USDC-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0,
    WETH_USDC_ADD,
    USDC.address,
    WrappedEthereum.address,
    "USDC-WETH"
  );
  console.log("USDC-WETH Vault setup successful");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Creating DAI StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000",
    DAI.address
  );
  console.log("DAI StableCoin Warp Vault created successfully");
  /////////////////////////////////////////////////////////////////////////
  console.log("Creating USDC StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000",
    USDC.address
  );
  console.log("USDC StableCoin Warp Vault created successfully");
  /////////////////////////////////////////////////////////////////////////
  console.log("Creating USDT StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0,
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000",
    USDT.address
  );
  console.log("USDT StableCoin Warp Vault created successfully");

  console.log("REACT_APP_LOCALHOST_ULPOF=" + UniswapLPOracleFactory.address);
  console.log("REACT_APP_LOCALHOST_DAI=" + DAI.address);
  console.log("REACT_APP_LOCALHOST_USDC=" + USDC.address);
  console.log("REACT_APP_LOCALHOST_USDT=" + USDT.address);
  console.log("REACT_APP_LOCALHOST_ETH_DAI=" + ETH_DAI);
  console.log("REACT_APP_LOCALHOST_ETH_USDT=" + ETH_USDT);
  console.log("REACT_APP_LOCALHOST_ETH_USDC=" + USDC_wETH);
  console.log("REACT_APP_LOCALHOST_ETH_WBTC=" + ETH_wBTC);
  console.log("REACT_APP_LOCALHOST_CONTROL=" + WarpControl.address);
};
