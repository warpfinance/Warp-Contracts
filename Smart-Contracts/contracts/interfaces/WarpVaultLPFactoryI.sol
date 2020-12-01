pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultLPFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultLPFactory contract is designed to produce individual WarpVaultLP contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

abstract contract WarpVaultLPFactoryI {
    /**
      @notice createWarpVaultLP allows the contract owner to create a new WarpVaultLP contract for a specific LP token
      @param _lp is the address for the LP token this Warp Vault will manage
      @param _lpName is the name of the LP token (ex:wETH-wBTC)
      @param _lpName is the name of the LP token (ex:wETH-wBTC)
      **/
    function createWarpVaultLP(uint256 _timelock, address _lp, string memory _lpName)
        public
        virtual
        returns (address);

    function transferOwnership(address _newOwner) public virtual;

}
