contract("Warp Finance Demo", function (accounts) {

  it("Give eth", async () => {

    const t = await web3.eth.sendTransaction({
      from: accounts[6],
      to: "0x7f3A152F09324f2aee916CE069D3908603449173",
      value: web3.utils.toWei("5")
    }, (e, h) => {
      console.log(e);
      console.log(h);
    });

    console.log(t);

  })
})