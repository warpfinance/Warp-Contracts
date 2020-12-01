
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title USDC
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the USDC contract is used to simulate an ERC20 with uniswap on kovan
**/
contract USDC is  Ownable, ERC20 {

     constructor() public ERC20(
         "USDC",
         "USDC"
       ){
         _Mint(0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41,10000000000000000000000000000);
         _Mint(msg.sender,10000000000000000000000000000);
     }

     function _Mint(address _to, uint _amount) public onlyOwner {
       _mint(_to, _amount);
     }

     function _Burn(address _from, uint _amount) public onlyOwner {
         _burn(_from, _amount);
     }


}
