pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarpNFTRare is Ownable, ERC721 {
  uint public idTracker;
  string public URI;


/**
@notice the constructor function is fired only once during contract deployment
@param _URI is a base address added to the front of every input tokenURI
@dev assuming all NFT URI metadata is based on a URL he baseURI would be something like https://
**/
  constructor(string memory _URI) ERC721("Warp Rare NFT", "WRNFT") public {
    URI = _URI;
  }

/**
@notice mintNewNFT allows the owner of this contract to mint an input address a newNFT
@param _to is the address the NFT is being minted to
**/
  function mintNewNFT(address _to) public onlyOwner {
    idTracker = idTracker++;
    _safeMint(_to, idTracker);
    _setTokenURI(idTracker, URI);
  }



}
