pragma solidity ^0.6.0;

import "./WarpVaultSC.sol";
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

contract WarpVaultSCFactory is Ownable {
    function createNewSCVault(
        address _InterestRate,
        address _StableCoin,
        uint256 _initialExchangeRate,
        string memory _stableCoinName,
        string memory _stableCoinSymbol
    ) public returns (address) {
        address _WVSC = address(
            new WarpVaultSC(
                _InterestRate,
                _StableCoin,
                msg.sender,
                _initialExchangeRate,
                _stableCoinName,
                _stableCoinSymbol
            )
        );

        return _WVSC;
    }
}
