pragma solidity ^0.6.0;

import "./WarpVaultSC.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultLPFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The WarpVaultSCFactory contract is designed to produce individual WarpVaultLP contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract WarpVaultSCFactory is Ownable {
    /**
@notice createNewWarpVaultSC is used to create new WarpVaultSC contract instances
@param _InterestRate is the address of the InterestRateModel contract created for this Warp Vault
@param _StableCoin is the address of the stablecoin contract this WarpVault will manage
@param _initialExchangeRate is the exchange rate mantissa used to determine the initial exchange rate of stablecoin to warp stablecoin
  **/
    function createNewWarpVaultSC(
        address _InterestRate,
        address _StableCoin,
        uint256 _initialExchangeRate
    ) public onlyOwner returns (address) {
        address _WVSC = address(
            new WarpVaultSC(
                _InterestRate,
                _StableCoin,
                msg.sender,
                _initialExchangeRate
            )
        );

        return _WVSC;
    }
}
