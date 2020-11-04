pragma solidity ^0.6.0;

import "./WarpVaultLP.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultLPFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultLPFactory contract is designed to produce individual WarpVaultLP contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract WarpVaultLPFactory is Ownable {
    function createWarpVaultLP(address _lp, string memory _lpName)
        public
        onlyOwner
        returns (address)
    {
        address _WVLP = address(new WarpVaultLP(_lp, msg.sender, _lpName));

        return _WVLP;
    }
}
