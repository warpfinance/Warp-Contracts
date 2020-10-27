const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeLink = artifacts.require("FakeLink");
const FakeAugur = artifacts.require("FakeAugur");

module.exports = async deployer => {
  await deployer.deploy(
    MoneyMarketControl,
    UniswapOracleFactory.address,
    MoneyMarketFactory.address
  );
  console.log("Money Market Control Deployed!");
  UOF = await UniswapOracleFactory.deployed();
  await UOF.transferOwnership(MoneyMarketControl.address);
  console.log(
    "Uniswap oracle contract factory ownership transfered to Money Market Control contract"
  );
  MMC = await MoneyMarketControl.deployed();
  console.log("Setting up FakeAugur Money Market Instance");
  await MMC.whitelistAsset(FakeAugur.address, "FakeAugur", "FAG");
  console.log("FakeAugur White Listed");
  await MMC.setUpAHR(
    "1000000000000000000", //base rate per year(approx target base APR)
    "2000000000000000000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "2000000000000000000", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    4204800, //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeAugur.address //asset address
  );
  console.log("FakeAugur Asko High Risk Token Created");
  await MMC.setUpALR(
    "2000000000000000000",
    "3000000000000000000",
    "3000000000000000000",
    8409600,
    50,
    "2000000000000000000",
    FakeAugur.address
  );
  console.log("FakeAugur Asko Low Risk Token Created");
  console.log("Setting up FakeLink Money Market Instance");
  await MMC.whitelistAsset(FakeLink.address, "FakeLink", "FAL");
  console.log("FakeLink White Listed");
  await MMC.setUpAHR(
    "3000000000000000000",
    "4000000000000000000",
    "4000000000000000000",
    16819200,
    50,
    "3000000000000000000",
    FakeLink.address
  );
  console.log("FakeLink Asko High Risk Token Created");
  await MMC.setUpALR(
    "4000000000000000000",
    "5000000000000000000",
    "5000000000000000000",
    33638400,
    50,
    "4000000000000000000",
    FakeLink.address
  );
  console.log("FakeLink Asko Low Risk Token Created");
};
