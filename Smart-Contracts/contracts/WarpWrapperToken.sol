
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpWrapperToken
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the WarpWrapperToken contract is designed  as a token Wrapper to represent ownership of stablecoins added to a specific
        WarpVault. This contract inherits Ownership and ERC20 functionality from the Open Zeppelin Library.
**/
contract WarpWrapperToken is  Ownable, ERC20 {

  address public stablecoin;
  ///@notice constructor sets up token names and symbols for the WarpWrapperToken
     constructor( address _SC, string _tokenName, string _tokenSymbol) public ERC20(
         _tokenSymbol,
         _tokenName
       ){
         transferOwnership(msg.sender);
         stablecoin = _SC;
     }

     function _Mint(address _to, uint _amount) public onlyOwner {
       _mint(_to, _amount);
     }

     function _Burn(address _from, uint _amount) public onlyOwner {
         _burn(_from, _amount);
     }


}
