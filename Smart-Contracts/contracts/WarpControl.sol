pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/WarpVaultSCI.sol";
import "./interfaces/WarpVaultLPI.sol";
import "./interfaces/WarpVaultLPFactoryI.sol";
import "./interfaces/WarpVaultSCFactoryI.sol";
import "./interfaces/UniswapLPOracleFactoryI.sol";
import "./compound/JumpRateModelV2.sol";
import "./compound/Exponential.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title WarpControl
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
WarpControl is designed to coordinate Warp Vaults
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract WarpControl is Ownable, Exponential {
    using SafeMath for uint256;

    uint256 public liquidationIncentiveMantissa = 1.5e18; // 1.5

    UniswapLPOracleFactoryI public Oracle; //oracle factory contract interface
    WarpVaultLPFactoryI public WVLPF;
    WarpVaultSCFactoryI public WVSCF;

    address[] public lpVaults;
    address[] public scVaults;

    mapping(address => address) public instanceLPTracker; //maps LP token address to the assets WarpVault
    mapping(address => address) public instanceSCTracker;
    mapping(address => uint256) public lockedLPValue;
    mapping(address => bool) public isVault;

    /**
     * @dev Throws if called by any account other than a warp vault
     */
    modifier onlyVault() {
        require(isVault[msg.sender] == true);
        _;
    }

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
    constructor(
        address _oracle,
        address _WVLPF,
        address _WVSCF
    ) public {
        Oracle = UniswapLPOracleFactoryI(_oracle);
        WVLPF = WarpVaultLPFactoryI(_WVLPF);
        WVSCF = WarpVaultSCFactoryI(_WVSCF);
    }

    /**
@notice createNewVault allows the contract owner to create a new WarpVaultLP contract along with its associated Warp Wrapper Tokens
**/
    function createNewLPVault(
        address _lp,
        address _lpAsset1,
        address _lpAsset2,
        string memory _lpName
    ) public onlyOwner {
        Oracle.createNewOracles(_lpAsset1, _lpAsset2, _lp);
        address _WarpVault = WVLPF.createWarpVaultLP(_lp, _lpName);
        instanceLPTracker[_lp] = _WarpVault;
        lpVaults.push(_WarpVault);
        isVault[_WarpVault] = true;
    }

    function createNewSCVault(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate,
        address _StableCoin
    ) public onlyOwner {
        address IR = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(this)
            )
        );

        address _WarpVault = WVSCF.createNewWarpVaultSC(
            IR,
            _StableCoin,
            _initialExchangeRate
        );
        instanceSCTracker[_StableCoin] = _WarpVault;
        scVaults.push(_WarpVault);
        isVault[_WarpVault] = true;
    }

    /**
   @notice lockCollateralDown is an external function used to track locked collateral amounts globally as they decrease
   @param _borrower is the address of the borrower
   @param _amount is the amount of LP being collateralized
   **/
    function unlockColateral(
        address _borrower,
        address _redeemer,
        uint256 _amount
    ) external onlyVault {
        uint256 numVaults = lpVaults.length;
        uint256 remaining = _amount;

        //loop through each LP vault
        for (uint256 i = 0; i < numVaults; ++i) {
            //instantiate warp vault at that position
            WarpVaultLPI vault = WarpVaultLPI(lpVaults[i]);
            //retreive the address of its asset
            address asset = vault.getAssetAdd();
            //retreive amount of LP locked in this vault
            uint256 amountOfLockedAsset = vault.collateralLPbalanceOf(
                _borrower
            );
            //get USDC value of LP
            uint256 lpValue = checkLPprice(asset);
            //get USDC value of the locked amount
            uint256 valueInVault = amountOfLockedAsset.mul(lpValue);
            //if the remaining amount is less than the borrowers collateral value in thie cuurent vault
            if (remaining <= valueInVault) {
                //amount of lp to unlock is the remaining USDC loan amount divided by the USDC value of one LP
                uint256 amountOfLP = remaining.div(lpValue);
                //call the LP's vault and unlock the LP to the redeemer
                vault.unlockLP(_borrower, _redeemer, amountOfLP);
            } else {
                //if the remaining amount is MORE than the value in the current LP vault
                //determine how much more is needed and roll it over into the remaining variable
                remaining = remaining.sub(valueInVault);
                //call the LP's vault and unlock all of the LP locked in it
                vault.unlockLP(_borrower, _redeemer, amountOfLockedAsset);
            }
        }
        lockedLPValue[_borrower] = lockedLPValue[_borrower].sub(_amount);
    }

    function checkLPprice(address _LP) public view returns (uint256) {
        return Oracle.getUnderlyingPrice(_LP);
    }

    /**
@notice checkCollateralValue is a view function that accepts an account address and returns the total USDC value
        of the accounts locked collateral
@param _account is the address whos collateral value we are looking up
 **/
    function checkTotalAvailableCollateralValue(address _account)
        public
        view
        returns (uint256)
    {
        uint256 numVaults = lpVaults.length;
        uint256 totalCollateral = 0;
        //loop through each lp wapr vault
        for (uint256 i = 0; i < numVaults; ++i) {
            //instantiate warp vault at that position
            WarpVaultLPI vault = WarpVaultLPI(lpVaults[i]);
            //retreive the address of its asset
            address asset = vault.getAssetAdd();
            //retrieve USD price of this asset
            uint256 assetPrice = Oracle.getUnderlyingPrice(asset);
            //retrieve the total amount of the asset availible as collateral
            uint256 availibleAccountAssets = IERC20(asset).balanceOf(_account);
            //retreive the amount of the asset locked as collateral
            uint256 amountOfLockedAsset = vault.collateralLPbalanceOf(_account);
            //calculate amount of collateral not locked up
            uint256 accountAssets = availibleAccountAssets.sub(
                amountOfLockedAsset
            );
            //multiply the amount of collateral by the asset price and return it
            uint256 accountAssetsValue = accountAssets.mul(assetPrice);
            //add value to total collateral
            totalCollateral = totalCollateral.add(accountAssetsValue);
        }
        //return total USDC value of all collateral
        return totalCollateral;
    }

    function borrowSC(address _StableCoin, uint256 _amount) public {
        uint256 numSCVaults = scVaults.length;
        uint256 borrowedTotal = 0;
        //retreive total amount of collateral value the user has
        uint256 availibleCollateralValue = checkTotalAvailableCollateralValue(
            msg.sender
        );
        //loop through all stable coin vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate each LP warp vault
            WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            //retreive the amount user has borrowed from each stablecoin vault
            borrowedTotal = borrowedTotal.add(
                WVSC.borrowBalanceCurrent(msg.sender)
            );
        }
        //divide collateral value by half and add the half to the full value for a 150% collateral value
        uint256 halfCollat = availibleCollateralValue.div(2);
        availibleCollateralValue = availibleCollateralValue.add(halfCollat);
        //calculate USDC amount of what the user is aloud to borrow
        uint256 borrowAmountAllowed = availibleCollateralValue.sub(
            borrowedTotal
        );
        //require the amount being borrowed is less than or equal to the amount they are aloud to borrow
        require(borrowAmountAllowed >= _amount);
        //track USDC value of locked LP
        lockedLPValue[msg.sender] = lockedLPValue[msg.sender].add(_amount);
        //retreive stablecoin vault address being borrowed from and instantiate it
        WarpVaultSCI WV = WarpVaultSCI(instanceSCTracker[_StableCoin]);
        //call borrow function on the stablecoin warp vault
        WV.borrow(_amount, msg.sender);
    }
}
