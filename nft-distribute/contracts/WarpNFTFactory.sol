pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarpNFTFactory is Ownable, ERC721 {
  uint public idTracker;

  mapping(uint => uint) public tokenType;

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
@param _type is a number delineating what type of token the user holds for use on chain
@param _tokenURI is the input URI that links over the newly created NFT's token data
**/
  function mintNewNFT(address _to, uint _type, string memory _tokenURI) public onlyOwner {
    idTracker = idTracker++;
    _safeMint(_to, idTracker);
    _setTokenURI(idTracker, _tokenURI);
    tokenType[idTracker] = _type;
  }

/**
@notice getUserRewardLevel is used to retreive the token type of a token an account holds
@param _account is the account in question
@dev this function first checks if the account holds any NFTs. If the account does hold NFT's
      then this function loops through each NFT to determine which type of NFT the account holds.
      If the account holds a token that is type 1-3 this function will return its token type. If
      the account doesnt hold any NFT's OR only holds a social NFT it will return 0. As social NFTs are the
      last type to be created for an account in the claim NFT function other NFTs should be found first meaning this
      function will return their type first.
**/
  function getUserRewardLevel(address _account) public view returns(uint) {
      uint numOfTokensHeld = balanceOf(_account);
      if(numOfTokensHeld > 0) {
        for (uint256 i = 0; i < idTracker; ++i) {
          address isAddress = ownerOf(i);
          if(_account == isAddress) {
            if(tokenType[i] != 4){
              return tokenType[i];
            } else {
              return 0
            }
          }
        }
      } else {
        return 0;
      }
  }

}
