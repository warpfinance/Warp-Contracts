pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarpNFTLegendary is Ownable, ERC721 {
  uint public idTracker;
  string public URI;


/**
@notice the constructor function is fired only once during contract deployment
@param _URI is a base address added to the front of every input tokenURI
@dev assuming all NFT URI metadata is based on a URL he baseURI would be something like https://
**/
  constructor(string memory _URI) ERC721("Warp Legendary NFT", "WLNFT") public {
    URI = _URI;
    idTracker = 0;
  }

/**
@notice mintNewNFT allows the owner of this contract to mint an input address a newNFT
@param _to is the address the NFT is being minted to
**/
  function mintNewNFT(address _to) public onlyOwner {
    _safeMint(_to, idTracker);
    _setTokenURI(idTracker, URI);
    idTracker++;
  }

/**
@notice updateAllURIs allows the owner of this contract to manually update the token URI
@param _newURI is the new URI for the tokens
**/
  function updateAllURIs(string memory _newURI) public onlyOwner {
    URI = _newURI;
  }

/**
@notice updateTokenURI allows the owner of a token to update his tokens URI after the owner
        sets a new one for use
@param _tokenID is the ID of the token being upgraded
**/
  function updateTokenURI(uint _tokenID) public {
    require(ownerOf(_tokenID) == msg.sender);
    _setTokenURI(_tokenID, URI);
  }

}
