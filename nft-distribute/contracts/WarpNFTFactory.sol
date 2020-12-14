pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarpNFTFactory is Ownable, ERC721 {
  uint public idTracker;

/**
@notice the constructor function is fired only once during contract deployment
@param _baseURI is a base address added to the front of every input tokenURI
@dev assuming all NFT URI metadata is based on a URL he baseURI would be something like https://
**/
  constructor(string memory _baseURI) ERC721("WarpNFT", "WNFT") {
    _setBaseURI(_baseURI);
  }

/**
@notice mintNewNFT allows the owner of this contract to mint an input address a newNFT
@param _to is the address the NFT is being minted to
@param _tokenURI is the input URI that links over the newly created NFT's token data 
**/
  function mintNewNFT(address _to, string memory _tokenURI) public onlyOwner {
    idTracker = idTracker++;
    _safeMint(_to, idTracker);
    _setTokenURI(idTracker, _tokenURI);
  }

}
