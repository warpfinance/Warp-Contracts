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

    mapping(address => uint256) nonCompliant;
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
    @notice Figures out how much of a given LP token an account is allowed to withdraw
     */
    function getMaxWithdrawAllowed(address account, address lpToken) public returns (uint256) {
        uint256 borrowedTotal = getTotalBorrowedValue(account);
        uint256 borrowLimit = getBorrowLimit(account);
        uint256 lpValue = Oracle.getUnderlyingPrice(lpToken);
        uint256 leftoverBorrowAmount = borrowLimit.sub(borrowedTotal);

        return leftoverBorrowAmount.div(lpValue);
    }

    function viewMaxWithdrawAllowed(address account, address lpToken) public view returns (uint256) {
        uint256 borrowedTotal = viewTotalBorrowedValue(account);
        uint256 borrowLimit = viewBorrowLimit(account);
        uint256 lpValue = Oracle.viewUnderlyingPrice(lpToken);
        uint256 leftoverBorrowAmount = borrowLimit.sub(borrowedTotal);

        return leftoverBorrowAmount.div(lpValue);
    }

    //event DebugValues(uint256 collateral, uint256 oraclePrice);


    function getTotalAvailableCollateralValue(address _account)
        public
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
            
            uint256 accountCollateral = vault.collateralOfAccount(_account);
            //emit DebugValues(accountCollateral, assetPrice);

            //multiply the amount of collateral by the asset price and return it
            uint256 accountAssetsValue = accountCollateral.mul(assetPrice);
            //add value to total collateral
            totalCollateral = totalCollateral.add(accountAssetsValue);
        }
        //return total USDC value of all collateral
        return totalCollateral;
    }

    function viewTotalAvailableCollateralValue(address _account)
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
            uint256 assetPrice = Oracle.viewUnderlyingPrice(asset);
            
            uint256 accountCollateral = vault.collateralOfAccount(_account);

            //multiply the amount of collateral by the asset price and return it
            uint256 accountAssetsValue = accountCollateral.mul(assetPrice);
            //add value to total collateral
            totalCollateral = totalCollateral.add(accountAssetsValue);
        }
        //return total USDC value of all collateral
        return totalCollateral;
    }

    function viewTotalBorrowedValue(address _account) public view returns (uint256) {
        uint256 numSCVaults = scVaults.length;
        uint256 totalBorrowedValue = 0;

        //loop through all stable coin vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate each LP warp vault
            WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            //retreive the amount user has borrowed from each stablecoin vault
            totalBorrowedValue = totalBorrowedValue.add(
                WVSC.borrowBalancePrior(_account)
            );
        }

        return totalBorrowedValue;
    }

    function getTotalBorrowedValue(address _account) public returns (uint256) {
        uint256 numSCVaults = scVaults.length;
        uint256 totalBorrowedValue = 0;

        //loop through all stable coin vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate each LP warp vault
            WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            //retreive the amount user has borrowed from each stablecoin vault
            totalBorrowedValue = totalBorrowedValue.add(
                WVSC.borrowBalanceCurrent(_account)
            );
        }

        return totalBorrowedValue;
    }

    function calcBorrowLimit(uint256 collateralValue) public pure returns (uint256) {
        uint256 halfCollat = collateralValue.div(2);
        collateralValue = collateralValue.add(halfCollat);

        return collateralValue;
    }

    function getBorrowLimit(address _account) public returns (uint256) {
        uint256 availibleCollateralValue = getTotalAvailableCollateralValue(
            _account
        );

        return calcBorrowLimit(availibleCollateralValue);
    }

    function viewBorrowLimit(address _account) public view returns (uint256) {
        uint256 availibleCollateralValue = viewTotalAvailableCollateralValue(
            _account
        );

        return calcBorrowLimit(availibleCollateralValue);
    }

    function borrowSC(address _StableCoin, uint256 _amount) public {
        uint256 borrowedTotal = getTotalBorrowedValue(msg.sender);
        uint256 availibleCollateralValue = getBorrowLimit(msg.sender);
        
        //calculate USDC amount of what the user is allowed to borrow
        uint256 borrowAmountAllowed = availibleCollateralValue.sub(
            borrowedTotal
        );

        //require the amount being borrowed is less than or equal to the amount they are aloud to borrow
        require(borrowAmountAllowed >= _amount, "Borrowing more than allowed");
        //track USDC value of locked LP
        lockedLPValue[msg.sender] = lockedLPValue[msg.sender].add(_amount);
        //retreive stablecoin vault address being borrowed from and instantiate it
        WarpVaultSCI WV = WarpVaultSCI(instanceSCTracker[_StableCoin]);
        //call borrow function on the stablecoin warp vault
        WV.borrow(_amount, msg.sender);
    }

    /**
      @notice markAccountNonCompliant is used by a potential liquidator to mark an account as non compliant which starts its 30 minute timer
      @param _borrower is the address of the non compliant borrower
      **/
    function markAccountNonCompliant(address _borrower)
        public
    {
        //needs to check for account compliance
        require(nonCompliant[_borrower] == 0);
        nonCompliant[_borrower] = now;
    }

    function liquidateAccount(address borrower) public {
        require(now >= nonCompliant[borrower].add(1800));

        uint256 numSCVaults = scVaults.length;
        uint256 borrowedAmount = 0;
        uint256[] memory scBalances = new uint256[](numSCVaults);

        // Borrowed Amount From All Vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            WarpVaultSCI scVault = WarpVaultSCI(scVaults[i]);
            scBalances[i] = scVault.borrowBalanceCurrent(borrower);
            borrowedAmount = borrowedAmount.add(
                scBalances[i]
            );
        }

        uint256 borrowLimit = getBorrowLimit(borrower);

        nonCompliant[borrower] = 0;

        if (borrowLimit > borrowedAmount) {
            // The account was in good standing
            return;
        }

        // Liquidate the account

        // Liquidator pays off Stable Coin loans
        for (uint256 i = 0; i < numSCVaults; ++i) {
             WarpVaultSCI scVault = WarpVaultSCI(scVaults[i]);
             scVault.repayLiquidatedLoan(borrower, msg.sender, scBalances[i]);
        }

        // Liquidator gets the LP tokens the borrower had
        uint256 numLPVaults = lpVaults.length;
        for (uint256 i = 0; i < numLPVaults; ++i ) {
            WarpVaultLPI lpVault = WarpVaultLPI(lpVaults[i]);
            lpVault.liquidateAccount(borrower, msg.sender);
        }

    }
}
