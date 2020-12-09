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

module.exports = async (deployer, network, accounts) => {
  const ownerAddress = accounts[0];
  const locktime = 604800 + now;

  const UNI = await UniswapV2Factory.at(
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  );
  const UNI_R = await UniswapV2Router02.at(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  );

  ////////////////////////////////////////////////////////////////////////////////////////////

  await deployer.deploy(
    UniswapLPOracleFactory,
    USDC,
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
  const WETH_DAI_ADD = await UNI.getPair(WrappedEthereum, DAI);
  const WBTC_WETH_ADD = await UNI.getPair(WrappedEthereum, WrappedBitcoin);
  const WETH_USDT_ADD = await UNI.getPair(WrappedEthereum, USDT);
  const WETH_USDC_ADD = await UNI.getPair(WrappedEthereum, USDC);

  ///////////////////////////pairs retrieved///////////
  await WarpC.createNewLPVault(
    0, //time lock
    WETH_DAI_ADD,
    WrappedEthereum,
    DAI,
    "WETH-DAI"
  );
  console.log("WETH-DAI Vault setup successful");
  console.log("Creating WBTC-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0, //time lock
    WBTC_WETH_ADD,
    WrappedBitcoin,
    WrappedEthereum,
    "WBTC-WETH"
  );
  console.log("WBTC-WETH Vault setup successful");
  console.log("Creating USDT-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0, //time lock
    WETH_USDT_ADD,
    USDT,
    WrappedEthereum,
    "USDT-WETH"
  );
  console.log("USDT-WETH Vault setup successful");
  console.log("Creating USDC-WETH Warp Vault");
  await WarpC.createNewLPVault(
    0, //time lock
    WETH_USDC_ADD,
    USDC,
    WrappedEthereum,
    "USDC-WETH"
  );
  console.log("USDC-WETH Vault setup successful");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Creating DAI StableCoin Warp Vault");
  await WarpC.createNewSCVault(
    0, //time lock
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    "500000000000000000", //reserve factor for fees
    DAI
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
    "500000000000000000", //reserve factor for fees
    USDC
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
    "500000000000000000", //reserve factor for fees
    USDT
  );
  console.log("USDT StableCoin Warp Vault created successfully");

  console.log("REACT_APP_LOCALHOST_ULPOF=" + UniswapLPOracleFactory.address);
  console.log("REACT_APP_LOCALHOST_DAI=" + DAI);
  console.log("REACT_APP_LOCALHOST_USDC=" + USDC);
  console.log("REACT_APP_LOCALHOST_USDT=" + USDT);
  console.log("REACT_APP_LOCALHOST_ETH_DAI=" + WETH_DAI_ADD);
  console.log("REACT_APP_LOCALHOST_ETH_USDT=" + WETH_USDT_ADD);
  console.log("REACT_APP_LOCALHOST_ETH_USDC=" + WETH_USDC_ADD);
  console.log("REACT_APP_LOCALHOST_ETH_WBTC=" + WBTC_WETH_ADD);
  console.log("REACT_APP_LOCALHOST_CONTROL=" + WarpControl.address);
};
