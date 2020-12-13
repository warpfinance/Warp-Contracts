const DAI = artifacts.require("DAI");
const USDC = artifacts.require("USDC");
const TetherToken = artifacts.require("TetherToken");
const WrappedBitcoin = artifacts.require("WrappedBitcoin");
const WrappedEthereum = artifacts.require("WrappedEthereum");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");

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

module.exports = async (deployer, network, accounts) => {
  const ownerAddress = "0x7f3A152F09324f2aee916CE069D3908603449173";
  const testerAddresses = [
    ownerAddress,
    "0xC6429e05edE87133537eC17b1f5ab99a0ec6CCEb",
    "0xb2bD8248B0253CfD08cd346FF668C82b8d8F6447",
    "0x744825189eb3Ba671A3e881143214DA6b187E5b8",
    "0x04F901C2B7983103f18d04A3dBA34789Aaee076e",
    "0x7f3A152F09324f2aee916CE069D3908603449173",
    "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41",
  ]

  if (network.search("kovan") == -1 && network != "development") {
    return;
  }

  console.log("Initiate the Token Canon...");
  await deployer.deploy(DAI);
  console.log("Deploying the DAI....");
  await deployer.deploy(USDC);
  console.log("Unconforming to the ERC20 standard.....");
  await deployer.deploy(TetherToken,
    amountWithDecimals("10000000", "6"),
    "Tether",
    "USDT",
    "6"
  );

  console.log("Inflating the US dollar.....");
  await deployer.deploy(WrappedBitcoin);
  console.log("Making Bitcoin usable.....");
  await deployer.deploy(WrappedEthereum);
  console.log("Wrapping the Ethereum.......");

  console.log("Deploying the uniswap factory...");
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
  const uniswapFactory = await UniswapV2Factory.deployed();
  const uniswapRouter = await UniswapV2Router02.deployed();

  const usdc = await USDC.deployed();
  const dai = await DAI.deployed();
  const usdt = await TetherToken.deployed();
  const wbtc = await WrappedBitcoin.deployed();
  const weth = await WrappedEthereum.deployed();

  const usdcDecimals = parseBigNumber(await usdc.decimals());
  const usdtDecimals = parseBigNumber(await usdt.decimals());
  const daiDecimals = parseBigNumber(await dai.decimals());
  const wbtcDecimals = parseBigNumber(await wbtc.decimals());
  const wethDecimals = parseBigNumber(await weth.decimals());

  const largeAmount = (new BigNumber(2)).pow(255);
  const largeAmountWithDecimals = largeAmount.toString();
  const deadline = 100000000000000;

  /* Approve the router to send accounts[0]'s tokens */
  await usdc.approve(uniswapRouter.address, largeAmountWithDecimals);
  await wbtc.approve(uniswapRouter.address, largeAmountWithDecimals);
  await dai.approve(uniswapRouter.address, largeAmountWithDecimals);
  await usdt.approve(uniswapRouter.address, largeAmountWithDecimals);
  await weth.approve(uniswapRouter.address, largeAmountWithDecimals);



  /* USDC - wBTC */
  console.log("Listing USDC-wBTC");
  await uniswapFactory.createPair(usdc.address, wbtc.address);
  const USDC_wBTC = await uniswapFactory.getPair(usdc.address, wbtc.address);
  console.log("USDC-wBTC pair created");
  console.log(USDC_wBTC);
  const pair2 = await UniswapV2Pair.at(USDC_wBTC);
  await pair2.sync();
  console.log("Listed USDC-wBTC");


  /* USDC - DAI */
  console.log("Listing USDC-DAI");
  await uniswapFactory.createPair(usdc.address, dai.address);
  const USDC_DAI = await uniswapFactory.getPair(usdc.address, dai.address);
  console.log("USDC-DAI pair created");
  console.log(USDC_DAI);
  const pair3 = await UniswapV2Pair.at(USDC_DAI);
  await pair3.sync();
  console.log("Listed USDC-DAI");


  /* USDC - USDT */
  console.log("Listing USDC-USDT");
  await uniswapFactory.createPair(usdc.address, usdt.address);
  const USDC_USDT = await uniswapFactory.getPair(usdc.address, usdt.address);
  console.log("USDC-USDT pair created");
  console.log(USDC_USDT);
  const pair4 = await UniswapV2Pair.at(USDC_USDT);
  await pair4.sync();
  console.log("Listed USDC-USDT");


  /* USDC - wETH */
  console.log("Listing USDC-wETH");
  await uniswapFactory.createPair(usdc.address, weth.address);
  const USDC_wETH = await uniswapFactory.getPair(usdc.address, weth.address);
  console.log("USDC-wETH pair created");
  console.log(USDC_wETH);
  const pair1 = await UniswapV2Pair.at(USDC_wETH);
  await pair1.sync();
  console.log("Listed USDC-wETH");


  /* ETH - wBTC */
  console.log("Listing ETH-wBTC");
  await uniswapFactory.createPair(weth.address, wbtc.address);
  const ETH_wBTC = await uniswapFactory.getPair(
    weth.address,
    wbtc.address
  );
  console.log("ETH-wBTC pair created");
  console.log(ETH_wBTC);
  const pair5 = await UniswapV2Pair.at(ETH_wBTC);
  await pair5.sync();
  console.log("Listed ETH-wBTC");

  
  /* ETH - USDT */
  console.log("Listing ETH-USDT");
  await uniswapFactory.createPair(weth.address, usdt.address);
  const ETH_USDT = await uniswapFactory.getPair(
    weth.address,
    usdt.address
  );
  console.log("ETH-USDT pair created");
  console.log(ETH_USDT);
  const pair6 = await UniswapV2Pair.at(ETH_USDT);
  await pair6.sync();
  console.log("Listed ETH-USDT");

  /* ETH-DAI */
  console.log("Listing ETH-DAI");
  await uniswapFactory.createPair(weth.address, dai.address);
  const ETH_DAI = await uniswapFactory.getPair(weth.address, dai.address);
  console.log("ETH-DAI pair created");
  console.log(ETH_DAI);
  const pair7 = await UniswapV2Pair.at(ETH_DAI);
  await pair7.sync();
  console.log("Listed ETH-DAI");

  /* Finished listing Pairs */

  /* give USDC-XXX pairs some reserves */
  const baseLiquidity = 100000;
  await uniswapRouter.addLiquidity(
    usdc.address,
    dai.address,
    amountWithDecimals(baseLiquidity, usdcDecimals),
    amountWithDecimals(baseLiquidity, daiDecimals), 
    "0",
    "0",
    accounts[0],
    deadline
  );
  await uniswapRouter.addLiquidity(
    usdc.address,
    usdt.address,
    amountWithDecimals(baseLiquidity, usdcDecimals),
    amountWithDecimals(baseLiquidity, usdtDecimals), 
    "0",
    "0",
    accounts[0],
    deadline
  );
  await uniswapRouter.addLiquidity(
    usdc.address,
    wbtc.address,
    amountWithDecimals(baseLiquidity, usdcDecimals),
    amountWithDecimals(baseLiquidity * 35 * 400, wbtcDecimals), 
    "0",
    "0",
    accounts[0],
    deadline
  );
  await uniswapRouter.addLiquidity(
    usdc.address,
    weth.address,
    amountWithDecimals(baseLiquidity, usdcDecimals),
    amountWithDecimals(baseLiquidity * 400, wethDecimals), 
    "0",
    "0",
    accounts[0],
    deadline
  );


  /* Give our testers some tokens */
  const testTokenAmount = 1000;
  for (const tester of testerAddresses) {
    console.log(`Giving ${tester} some LP tokens`);
    await uniswapRouter.addLiquidity(
      usdc.address,
      weth.address,
      amountWithDecimals(400 * testTokenAmount, usdcDecimals), //$400 USDC
      amountWithDecimals(1 * testTokenAmount, wethDecimals), // 1 ETH
      "0", //$300 USDC
      "0", // 0.9 ETH
      tester,
      deadline
    );
    await uniswapRouter.addLiquidity(
      weth.address,
      wbtc.address,
      amountWithDecimals(35 * testTokenAmount, wethDecimals), //35 eth
      amountWithDecimals(1 * testTokenAmount, wbtcDecimals), //one btc
      "0",
      "0",
      tester,
      deadline
    );
    await uniswapRouter.addLiquidity(
      usdt.address,
      weth.address,
      amountWithDecimals(400 * testTokenAmount, usdtDecimals), //$400 USDT
      amountWithDecimals(1 * testTokenAmount, wethDecimals), // 1 ETH
      "0",
      "0",
      tester,
      deadline
    );
    await uniswapRouter.addLiquidity(
      dai.address,
      weth.address,
      amountWithDecimals(400 * testTokenAmount, daiDecimals), //$400 DAI
      amountWithDecimals(1 * testTokenAmount, wethDecimals), // 1 ETH
      "0",
      "0",
      tester,
      deadline
    );
  }

  if (network == "development") {
    console.log("REACT_APP_LOCALHOST_DAI= = " + DAI.address);
    console.log("REACT_APP_LOCALHOST_USDC=" + USDC.address);
    console.log("REACT_APP_LOCALHOST_USDT=" + TetherToken.address);
    console.log("REACT_APP_LOCALHOST_ETH_DAI=" + ETH_DAI);
    console.log("REACT_APP_LOCALHOST_ETH_USDT=" + ETH_USDT);
    console.log("REACT_APP_LOCALHOST_ETH_USDC=" + USDC_wETH);
    console.log("REACT_APP_LOCALHOST_ETH_WBTC=" + ETH_wBTC);
  } else if (network.search("kovan") >= 0) {
    console.log("kovan DAI = " + DAI.address);
    console.log("kovan USDC = " + USDC.address);
    console.log("kovan USDT = " + TetherToken.address);
    console.log("kovan ETH_DAI = " + ETH_DAI);
    console.log("kovan ETH_USDT = " + ETH_USDT);
    console.log("kovan ETH_USDC = " + USDC_wETH);
    console.log("kovan ETH_WBTC = " + ETH_wBTC);
  }
  
};
