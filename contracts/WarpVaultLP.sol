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

    mapping(address => uint256) public collateralizedLP;

    /**
     * @dev Throws if called by any account other than a warp control
     */
    modifier onlyWC() {
        require(msg.sender == address(WC));
        _;
    }

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
    }

    /**
@notice collateralizeLP allows a user to collateralize this contracts associated LP token
@param _amount is the amount of LP being collateralized
**/
    function collateralizeLP(uint256 _amount) public {
        //transfer the msg,senders lp's to this vault
        LPtoken.transferFrom(msg.sender, address(this), _amount);
        //track the amount taken
        collateralizedLP[msg.sender] = collateralizedLP[msg.sender].add(
            _amount
        );
    }

    /**
@notice getAssetAdd allows for easy retrieval of a WarpVaults LP token Adress
**/
    function getAssetAdd() public view returns (address) {
        return address(LPtoken);
    }

    function collateralLPbalanceOf(address _account)
        public
        view
        returns (uint256)
    {
        return collateralizedLP[_account];
    }

    /**
@notice withdrawLP allows the user to trade in his WarpLP tokens for hiss underlying LP token collateral
@param _amount is the amount of LP tokens he wishes to withdraw
**/
    function withdrawLP(uint256 _amount) public {
        //require the availible value of the LP locked in this contract the user has
        //is greater than or equal to the amount being withdrawn
        require(
            WC.checkAvailibleCollateralValue(msg.sender, address(this)) >=
                _amount
        );
        //subtract withdrawn amount from amount stored
        collateralizedLP[msg.sender] = collateralizedLP[msg.sender].sub(
            _amount
        );
        //transfer them their token
        LPtoken.transfer(msg.sender, _amount);
    }

    function unlockLP(
        address _borrower,
        address _redeemer,
        uint256 _amount
    ) public onlyWC {
        //subtract unlocked amount from total amount of LP the borrower has in the vault
        collateralizedLP[_borrower] = collateralizedLP[_borrower].sub(_amount);
        //transfer amount of LP token being unlocked to the redeemer
        //this is necissary inorder for liquidate to function properly
        LPtoken.transfer(_redeemer, _amount);
    }
}
