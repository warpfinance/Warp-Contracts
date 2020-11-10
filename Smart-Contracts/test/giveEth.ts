contract("Warp Finance Demo", function(accounts) {
  it("Give eth", async () => {
    const t = await web3.eth.sendTransaction(
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

    console.log(t);
  });
});
