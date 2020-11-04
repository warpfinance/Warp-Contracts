pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WarpWrapperToken.sol";
import "./interfaces/WarpControlI.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpVaultLP
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the WarpVaultLP contract is the main point of interface for a specific LP asset class and an end user in the
Warp lending platform. This contract is responsible for distributing WarpWrapper tokens in exchange for stablecoin assets,
holding and accounting of stablecoins and LP tokens and all associates lending/borrowing calculations for a specific Warp LP asset class.
This contract inherits Ownership and ERC20 functionality from the Open Zeppelin Library as well as Exponential and the InterestRateModel contracts
from the coumpound protocol.
**/

contract WarpVaultLP is Ownable {
    using SafeMath for uint256;

    string public lpName;

    IERC20 public LPtoken;
    WarpWrapperToken public WLP;
    WarpControlI public WC;

    mapping(address => mapping(address => uint256)) public lockedWLP;

    /**
@notice constructor sets up token names and symbols for the WarpWrapperToken
@param _lp is the address of the lp token a specific Warp vault will represent
@param _lpName is the name of the lp token
@dev this function instantiates the lp token as a useable object and generates three WarpWrapperToken contracts to represent
      each type of stable coin this vault can hold. this also instantiates each of these contracts as a usable object in this contract giving
      this contract the ability to call their mint and burn functions.
**/
    constructor(
        address _lp,
        address _WarpControl,
        string memory _lpName
    ) public {
        lpName = _lpName;
        LPtoken = IERC20(_lp);
        WC = WarpControlI(_WarpControl);
        WLP = new WarpWrapperToken(address(LPtoken), lpName, "WLPW");
    }

    /**
@notice collateralizeLP allows a user to collateralize this contracts associated LP token
@param _amount is the amount of LP being collateralized
**/
    function collateralizeLP(uint256 _amount) public {
        LPtoken.transferFrom(msg.sender, address(this), _amount);
        WLP.mint(msg.sender, _amount);
    }

    /**
@notice getAssetAdd allows for easy retrieval of a WarpVaults LP token Adress
**/
    function getAssetAdd() public view returns (address) {
        return address(LPtoken);
    }

    /**
@notice withdrawLP allows the user to trade in his WarpLP tokens for hiss underlying LP token collateral
@param _amount is the amount of LP tokens he wishes to withdraw
**/
    function withdrawLP(uint256 _amount) public {
        require(
            WC.checkAvailibleCollateralValue(msg.sender, address(this)) >=
                _amount
        );
        WLP.burn(msg.sender, _amount);
        LPtoken.transfer(msg.sender, _amount);
    }

    function lpBalanceOf(address _account) public view returns (uint256) {
        return WLP.balanceOf(_account);
    }

    function lockedWLPbalanceOf(address _account, address _lpVaultItsLockedIn)
        public
        view
        returns (uint256)
    {
        return lockedWLP[_account][_lpVaultItsLockedIn];
    }

    function lockWLP(
        address _account,
        address _lpVaultItsLockedIn,
        uint256 _amount
    ) public onlyOwner {
        WLP.burn(_account, _amount);
        lockedWLP[_account][_lpVaultItsLockedIn] = lockedWLP[_account][_lpVaultItsLockedIn]
            .add(_amount);
    }

    function unlockWLP(
        address _borrower,
        address _redeemer,
        address _lpVaultItsLockedIn,
        uint256 _amount
    ) public onlyOwner {
        require(_amount <= lockedWLP[_borrower][_lpVaultItsLockedIn]);
        lockedWLP[_borrower][_lpVaultItsLockedIn] = lockedWLP[_borrower][_lpVaultItsLockedIn]
            .add(_amount);
        WLP.mint(_redeemer, _amount);
    }
}
