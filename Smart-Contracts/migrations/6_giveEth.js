
module.exports = async (deployer, network, accounts) => {
  if (network !== "development") {
    console.log("Not on ganache");
    return;
  }

  await web3.eth.sendTransaction(
    {
      from: accounts[6],
      to: "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41",
      value: web3.utils.toWei("5")
    },
    (e, h) => {
      console.log(e);
      console.log(h);
    }
  );

  await web3.eth.sendTransaction(
    {
      from: accounts[6],
      to: "0x7f3A152F09324f2aee916CE069D3908603449173",
      value: web3.utils.toWei("5")
    },
    (e, h) => {
      console.log(e);
      console.log(h);
    }
  );
};
