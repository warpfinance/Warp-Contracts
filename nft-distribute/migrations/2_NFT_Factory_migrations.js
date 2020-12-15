const WarpNFTEpic = artifacts.require("WarpNFTEpic");
const WarpNFTLegendary = artifacts.require("WarpNFTLegendary");
const WarpNFTRare = artifacts.require("WarpNFTRare");
const WarpNFTSocial = artifacts.require("WarpNFTSocial");

module.exports = function(deployer) {
  deployer.deploy(WarpNFTEpic, "https://ipfs.io/ipfs/QmYBw8yDg7cCULM1sv1JStUWNtvWX4cxkR7fUp31m7cvW6");
  deployer.deploy(WarpNFTLegendary, "https://ipfs.io/ipfs/QmUpSnqWo7uUJidmPTUaGqR3MmKeRkPYb7ThsQGkUZ5AJk");
  deployer.deploy(WarpNFTRare, "https://ipfs.io/ipfs/QmRXfGNU6WqPjSPnC4jvYhAjRK4Zr3GNxhzXGqypwK8D2x");
  deployer.deploy(WarpNFTSocial, "https://ipfs.io/ipfs/QmXvWfNugEm1BvzJ28KXV9r3Www1bXP3bLwE8cJBdiDY6r");
};
