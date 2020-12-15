const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const truffleAssert = require("truffle-assertions");
const WarpNFTClaimControl = artifacts.require("WarpNFTClaimControl");
const WarpNFTEpic = artifacts.require("WarpNFTEpic");
const WarpNFTLegendary = artifacts.require("WarpNFTLegendary");
const WarpNFTRare = artifacts.require("WarpNFTRare");
const WarpNFTSocial = artifacts.require("WarpNFTSocial");

contract("NFTClaim", (accounts) => {
  let account_one = accounts[0];
  console.log(account_one)
  let account_two = accounts[1];
  let account_three = accounts[2];
  let account_four = accounts[3];
  let account_five = accounts[4];
  let account_six = accounts[5];
  let account_seven = accounts[6];
  let account_eight = accounts[7];
  let account_nine = accounts[8];
  let account_ten = accounts[9];
  let epicWinners = [account_one, account_two];
  let legendaryWinners = [account_three, account_four];
  let rareWinners = [account_five, account_six];
  let socialWinners = [account_seven, account_eight, account_nine];
  let Wclaim;
  let Wepic;
  let Wlegendary;
  let Wrare;
  let Wsocial;

  before(async function () {
     Wclaim = await WarpNFTClaimControl.deployed();
     Wepic = await WarpNFTEpic.deployed();
     Wlegendary = await WarpNFTLegendary.deployed();
     Wrare = await WarpNFTRare.deployed();
     Wsocial = await WarpNFTSocial.deployed();
     await Wepic.transferOwnership(WarpNFTClaimControl.address);
     await Wlegendary.transferOwnership(WarpNFTClaimControl.address);
     await Wrare.transferOwnership(WarpNFTClaimControl.address);
     await Wsocial.transferOwnership(WarpNFTClaimControl.address);
  });

  it("should check that the proper URI is set for each NFT", async () => {
    let retreivedURI = await Wepic.URI();
    assert.equal(
      retreivedURI,
      "https://ipfs.io/ipfs/QmYBw8yDg7cCULM1sv1JStUWNtvWX4cxkR7fUp31m7cvW6",
       "URI's DO NOT MATCH"
     );

     retreivedURI = await Wlegendary.URI();
     assert.equal(
       retreivedURI,
       "https://ipfs.io/ipfs/QmUpSnqWo7uUJidmPTUaGqR3MmKeRkPYb7ThsQGkUZ5AJk",
        "URI's DO NOT MATCH"
      );

      retreivedURI = await Wrare.URI();
      assert.equal(
        retreivedURI,
        "https://ipfs.io/ipfs/QmRXfGNU6WqPjSPnC4jvYhAjRK4Zr3GNxhzXGqypwK8D2x",
         "URI's DO NOT MATCH"
       );

       retreivedURI = await Wsocial.URI();
       assert.equal(
         retreivedURI,
         "https://ipfs.io/ipfs/QmXvWfNugEm1BvzJ28KXV9r3Www1bXP3bLwE8cJBdiDY6r",
          "URI's DO NOT MATCH"
        );
  })

  it("should add accounts one and two to the epic whitelist and allow them to claim epic NFT's", async () => {
    await Wclaim.epicWhiteLister(epicWinners, {from: account_one});
    await Wclaim.claimNFTs({from: account_one});
    let ownerOfTokenOne = await Wepic.ownerOf("0",{from: account_one});
    assert.equal(
      ownerOfTokenOne,
      account_one
    )
    await Wclaim.claimNFTs({from: account_two});
    let ownerOfTokenTwo = await Wepic.ownerOf("1",{from: account_two});
    assert.equal(
      ownerOfTokenTwo,
      account_two
    )
  })

  it("should add accounts three and four to the legendary whitelist and allow them to claim legendary NFT's", async () => {
    await Wclaim.legendaryWhiteLister(legendaryWinners, {from: account_one});
    await Wclaim.claimNFTs({from: account_three});
    let ownerOfTokenOne = await Wlegendary.ownerOf("0",{from: account_three});
    assert.equal(
      ownerOfTokenOne,
      account_three
    )
    await Wclaim.claimNFTs({from: account_four});
    let ownerOfTokenTwo = await Wlegendary.ownerOf("1",{from: account_four});
    assert.equal(
      ownerOfTokenTwo,
      account_four
    )
  })

  it("should add accounts five and six to the rare whitelist and allow them to claim rare NFT's", async () => {
    await Wclaim.rareWhiteLister(rareWinners, {from: account_one});
    await Wclaim.claimNFTs({from: account_five});
    let ownerOfTokenOne = await Wrare.ownerOf("0",{from: account_five});
    assert.equal(
      ownerOfTokenOne,
      account_five
    )
    await Wclaim.claimNFTs({from: account_six});
    let ownerOfTokenTwo = await Wrare.ownerOf("1",{from: account_six});
    assert.equal(
      ownerOfTokenTwo,
      account_six
    )
  })

  it("should add accounts seven, eight, nine and ten to the social whitelist and allow them to claim social NFT's", async () => {
    await Wclaim.socialWhiteLister(socialWinners, {from: account_one});
    await Wclaim.claimNFTs({from: account_seven});
    let ownerOfTokenOne = await Wsocial.ownerOf("0",{from: account_seven});
    assert.equal(
      ownerOfTokenOne,
      account_seven
    )
    await Wclaim.claimNFTs({from: account_eight});
    let ownerOfTokenTwo = await Wsocial.ownerOf("1",{from: account_eight});
    assert.equal(
      ownerOfTokenTwo,
      account_eight
    )
    await Wclaim.claimNFTs({from: account_nine});
    let ownerOfTokenThree = await Wsocial.ownerOf("2",{from: account_nine});
    assert.equal(
      ownerOfTokenThree,
      account_nine
    )
  })

  it("should show that account ten doesnt have an NFT to claim", async () => {
    await Wclaim.claimNFTs({from: account_ten});
    let epicBal = await Wepic.balanceOf(account_ten);
    let legendaryBal = await Wlegendary.balanceOf(account_ten);
    let rareBal = await Wrare.balanceOf(account_ten);
    let socialBal = await Wsocial.balanceOf(account_ten);
    assert.equal(
      epicBal,
      0
    )
    assert.equal(
      legendaryBal,
      0
    )
    assert.equal(
      rareBal,
      0
    )
    assert.equal(
      socialBal,
      0
    )
  })

  it("should check that every token type returns the correct URI", async () => {
    let epicTokenURI = await Wepic.tokenURI("0");
    let legendaryTokenURI = await Wlegendary.tokenURI("0");
    let rareTokenURI = await Wrare.tokenURI("0");
    let socialTokenURI = await Wsocial.tokenURI("0");

    assert.equal(
      epicTokenURI,
      "https://ipfs.io/ipfs/QmYBw8yDg7cCULM1sv1JStUWNtvWX4cxkR7fUp31m7cvW6",
       "URI's DO NOT MATCH"
     );

     assert.equal(
       legendaryTokenURI,
       "https://ipfs.io/ipfs/QmUpSnqWo7uUJidmPTUaGqR3MmKeRkPYb7ThsQGkUZ5AJk",
        "URI's DO NOT MATCH"
      );

      assert.equal(
        rareTokenURI,
        "https://ipfs.io/ipfs/QmRXfGNU6WqPjSPnC4jvYhAjRK4Zr3GNxhzXGqypwK8D2x",
         "URI's DO NOT MATCH"
       );

       assert.equal(
         socialTokenURI,
         "https://ipfs.io/ipfs/QmXvWfNugEm1BvzJ28KXV9r3Www1bXP3bLwE8cJBdiDY6r",
          "URI's DO NOT MATCH"
        );
  })
});
