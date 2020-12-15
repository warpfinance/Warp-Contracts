pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WarpNFTEpic.sol";
import "./WarpNFTLegendary.sol";
import "./WarpNFTRare.sol";
import "./WarpNFTSocial.sol";

contract WarpNFTClaimControl is Ownable {
  WarpNFTEpic public WNFTE;
  WarpNFTLegendary public WNFTL;
  WarpNFTRare public WNFTR;
  WarpNFTSocial public WNFTS;



  address[] public epicList;
  address[] public legendaryList;
  address[] public rareList;
  address[] public socialList;

  mapping(address => bool) public epicWhiteList;
  mapping(address => bool) public legendaryWhiteList;
  mapping(address => bool) public rareWhiteList;
  mapping(address => bool) public socialWhiteList;

  mapping(address => bool) public epicClaimed;
  mapping(address => bool) public legendaryClaimed;
  mapping(address => bool) public rareClaimed;
  mapping(address => bool) public socialClaimed;

/**
@notice the constructor function is fired only once during contract deployment

**/
  constructor(
    WarpNFTEpic _NFTEpic,
    WarpNFTLegendary _NFTLegendary,
    WarpNFTRare _NFTRare,
    WarpNFTSocial _NFTSocial
  ) public {
    WNFTE = _NFTEpic;
    WNFTL = _NFTLegendary;
    WNFTR = _NFTRare;
    WNFTS = _NFTSocial;
  }

/**
@notice epicWhiteLister takes in an array of addresses and whitelists them to receive the epic NFT
@param _addresses is an array of addresses to be whitelisted
@dev this function is protected by the onlyOwner modifier and can only be called by the owner of this contract
**/
function epicWhiteLister(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; ++i) {
        epicWhiteList[_addresses[i]] = true;
        epicList.push(_addresses[i]);
    }
}

/**
@notice legendaryWhiteLister takes in an array of addresses and whitelists them to receive the legendary NFT
@param _addresses is an array of addresses to be whitelisted
@dev this function is protected by the onlyOwner modifier and can only be called by the owner of this contract
**/
function legendaryWhiteLister(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; ++i) {
        legendaryWhiteList[_addresses[i]] = true;
        legendaryList.push(_addresses[i]);
    }
}

/**
@notice rareWhiteLister takes in an array of addresses and whitelists them to receive the rare NFT
@param _addresses is an array of addresses to be whitelisted
@dev this function is protected by the onlyOwner modifier and can only be called by the owner of this contract
**/
function rareWhiteLister(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; ++i) {
        rareWhiteList[_addresses[i]] = true;
        rareList.push(_addresses[i]);
    }
}

/**
@notice socialWhiteLister takes in an array of addresses and whitelists them to receive the social NFT
@param _addresses is an array of addresses to be whitelisted
@dev this function is protected by the onlyOwner modifier and can only be called by the owner of this contract
**/
function socialWhiteLister(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; ++i) {
        socialWhiteList[_addresses[i]] = true;
        socialList.push(_addresses[i]);
    }
}

/**
@notice claimNFTs is a public function that allows a end user to claim ALL of the NFT's they are owed by the warp platform
@dev this function uses the address whitelists to distribute the appropriate NFT's to warp users
@dev this function sets a tokens type when minting a new token. A tokens type can be used by other warp contracts
      to determine what type of token a user holds
      Type 1: Epic NFT
      Type 2: Legendary NFT
      Type 3: Rare NFT
      Type 4: Social NFT
**/
function claimNFTs() public {

  if(epicWhiteList[msg.sender] == true && epicClaimed[msg.sender] == false) {
    WNFTE.mintNewNFT(msg.sender);
    epicClaimed[msg.sender] = true;
  }

  if(legendaryWhiteList[msg.sender] == true && legendaryClaimed[msg.sender] == false) {
    WNFTL.mintNewNFT(msg.sender);
    legendaryClaimed[msg.sender] = true;
  }

  if(rareWhiteList[msg.sender] == true && rareClaimed[msg.sender] == false) {
    WNFTR.mintNewNFT(msg.sender);
    rareClaimed[msg.sender] = true;
  }

  if(socialWhiteList[msg.sender] == true && socialClaimed[msg.sender] == false) {
    WNFTS.mintNewNFT(msg.sender);
    socialClaimed[msg.sender] = true;
  }
}
/**
@notice upgradeClaimControl allows the owner of this contract to transfer ownership of all of the
        NFT contracts to a new claim control contract in the case of a future upgrade
@param _newCCadd is the address of the new Claim control contract
**/
function upgradeClaimControl(address _newCCadd) public onlyOwner {
  WNFTE.transferOwnership(_newCCadd);
  WNFTL.transferOwnership(_newCCadd);
  WNFTR.transferOwnership(_newCCadd);
  WNFTS.transferOwnership(_newCCadd);
}

/**
@notice updateEpicURI allows the owner of this contract to update the stored URI
@param _newURI is the new URI for the tokens
**/
function updateEpicURI(string memory _newURI) public onlyOwner {
  WNFTE.updateAllURIs(_newURI);
}
/**
notice updateLegendaryURI allows the owner of this contract to update the stored URI
param _newURI is the new URI for the tokens
**/
function updateLegendaryURI(string memory _newURI) public onlyOwner {
  WNFTL.updateAllURIs(_newURI);
}

/**
@notice updateRareURI allows the owner of this contract to update the stored URI
@param _newURI is the new URI for the tokens
**/
function updateRareURI(string memory _newURI) public onlyOwner {
  WNFTR.updateAllURIs(_newURI);
}
/**
@notice updateSocialURI allows the owner of this contract to update the stored URI
@param _newURI is the new URI for the tokens
**/
function updateSocialURI(string memory _newURI) public onlyOwner {
  WNFTS.updateAllURIs(_newURI);
}

///view function to check if an account holds a certain NFT
function hasEpic(address _account) public view returns(bool) {
  uint numOfTokens = WNFTE.balanceOf(_account);
  if(numOfTokens > 0) {
    return true;
  } else {
    return false;
  }
}

function hasLegendary(address _account) public view returns(bool) {
  uint numOfTokens = WNFTL.balanceOf(_account);
  if(numOfTokens > 0) {
    return true;
  } else {
    return false;
  }
}

function hasRare(address _account) public view returns(bool) {
  uint numOfTokens = WNFTR.balanceOf(_account);
  if(numOfTokens > 0) {
    return true;
  } else {
    return false;
  }
}

function hasSocial(address _account) public view returns(bool) {
  uint numOfTokens = WNFTS.balanceOf(_account);
  if(numOfTokens > 0) {
    return true;
  } else {
    return false;
  }
}

///view function to check if an account has claimed their NFTs
function canClaim(address _account) public view returns(bool) {
  if(epicWhiteList[_account] == true && epicClaimed[_account] == false) {
    return true;
  } else if(legendaryWhiteList[_account] == true && legendaryClaimed[_account] == false) {
    return true;
  } else if(rareWhiteList[_account] == true && rareClaimed[_account] == false) {
    return true;
  } else if(socialWhiteList[_account] == true && socialClaimed[_account] == false) {
    return true;
  } else {
    return false;
  }
}


}
