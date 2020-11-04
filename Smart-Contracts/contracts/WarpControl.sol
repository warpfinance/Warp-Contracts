pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WarpVaultSC.sol";
import "./interfaces/WarpVaultLPI.sol";
import "./interfaces/WarpVaultLPFactoryI.sol";
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
    WarpVaultSC public WVSC;

    address[] public lpVaults;

    mapping(address => address) public instanceTracker; //maps LP token address to the assets WarpVault

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
    constructor(
        address _oracle,
        address _DAI,
        address _USDC,
        address _USDT,
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate
    ) public {
        Oracle = UniswapLPOracleFactoryI(_oracle);

        address IR = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(this)
            )
        );

        WVSC = new WarpVaultSC(IR, _DAI, _USDC, _USDT, _initialExchangeRate);
    }

    /**
@notice createNewVault allows the contract owner to create a new WarpVaultLP contract along with its associated Warp Wrapper Tokens
**/
    function createNewLPVault(
        address _WVLPF,
        address _lp,
        address _lpAsset1,
        address _lpAsset2,
        string memory _lpName
    ) public onlyOwner {
        Oracle.createNewOracles(_lpAsset1, _lpAsset2, _lp);
        WVLPF = WarpVaultLPFactoryI(_WVLPF);
        address _WarpVault = WVLPF.createWarpVaultLP(_lp, _lpName);
        instanceTracker[_lp] = _WarpVault;
        lpVaults.push(_WarpVault);
    }

    /**
  @notice lockCollateralUp is an external function used to track locked collateral amounts globally as they increase
  @param _borrower is the address of the borrower
  @param _amount is the USDC value thats looking to be locked up
  **/
    function lockCollateralUp(
        address _borrower,
        address _WVLP,
        uint256 _amount
    ) external {
        WarpVaultLPI WV = WarpVaultLPI(_WVLP);
        WV.lockWLP(_borrower, _WVLP, _amount);
    }

    /**
   @notice lockCollateralDown is an external function used to track locked collateral amounts globally as they decrease
   @param _borrower is the address of the borrower
   @param _amount is the amount of LP being collateralized
   **/
    function lockCollateralDown(
        address _borrower,
        address _redeemer,
        address _WVLP,
        uint256 _amount
    ) external {
        WarpVaultLPI WV = WarpVaultLPI(_WVLP);
        WV.unlockWLP(_borrower, _redeemer, _WVLP, _amount);
    }

    function checkLPprice(address _LP) public view returns (uint256) {
        return Oracle.getUnderlyingPrice(_LP);
    }

    function checkLockedCollateral(address _borrower, address collateralVault)
        public
        view
        returns (uint256)
    {
        WarpVaultLPI WV = WarpVaultLPI(collateralVault);
        return WV.lockedWLPbalanceOf(_borrower, collateralVault);
    }

    /**
@notice checkCollateralValue is a view function that accepts an account address and returns the total USDC value
        of the accounts locked collateral
@param _borrower is the address whos collateral value we are looking up
 **/
    function checkAvailibleCollateralValue(
        address _borrower,
        address _WarpVault
    ) external view returns (uint256) {
        //instantiate warp vault at that position
        WarpVaultLPI WV = WarpVaultLPI(_WarpVault);
        //retreive the address of its asset
        address asset = WV.getAssetAdd();
        //retrieve USD price of this asset
        uint256 priceOfAsset = Oracle.getUnderlyingPrice(asset);
        //retrieve the amount of the asset locked as collateral
        uint256 amountOfAssetCollat = WV.lpBalanceOf(_borrower);
        //multiply the amount of collateral by the asset price and return it
        return amountOfAssetCollat.mul(priceOfAsset);
    }

    /**
    @notice checkCollateralValue is a view function that accepts an account address and returns the total USDC value
            of the accounts locked collateral
    @param _borrower is the address whos collateral value we are looking up
     **/
    function checkLockedCollateralValue(address _borrower, address _WarpVault)
        external
        view
        returns (uint256)
    {
        WarpVaultLPI WV = WarpVaultLPI(_WarpVault);
        //retreive the address of its asset
        address asset = WV.getAssetAdd();
        //retrieve USD price of this asset
        uint256 priceOfAsset = Oracle.getUnderlyingPrice(asset);
        //retrieve the amount of the asset locked as collateral
        uint256 amountOfAssetCollat = WV.lockedWLPbalanceOf(
            _borrower,
            _WarpVault
        );
        //multiply the amount of collateral by the asset price and return it
        return amountOfAssetCollat.mul(priceOfAsset);
    }
}
