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
    @param _WVLPF is the address for the WarpVaultLPFactory used to produce LP Warp Vaults
    @param _WVSCF is the address for the WarpVaultSCFactory used to produce Stable Coin Warp Vaults
    @dev These factories are split into seperate contracts to avoid hitting the block gas limit
    **/
    constructor(
        address _oracle,
        address _WVLPF,
        address _WVSCF
    ) public {
        //instantiate the contracts
        Oracle = UniswapLPOracleFactoryI(_oracle);
        WVLPF = WarpVaultLPFactoryI(_WVLPF);
        WVSCF = WarpVaultSCFactoryI(_WVSCF);
    }

    function viewNumLPVaults() external view returns(uint256) {
        return lpVaults.length;
    }

    function viewNumSCVaults() external view returns(uint256) {
        return scVaults.length;
    }

    /**
    @notice createNewLPVault allows the contract owner to create a new WarpVaultLP contract for a specific LP token
    @param _lp is the address for the LP token this Warp Vault will manage
    @param _lpAsset1 is the address for the first asset in a pair that the LP token represents(ex: wETH in a wETH-wBTC uniswap pair)
    @param _lpAsset2 is the address for the second asset in a pair that the LP token represents(ex: wBTC in a wETH-wBTC uniswap pair)
    @param _lpName is the name of the LP token (ex:wETH-wBTC)
    **/
    function createNewLPVault(
        address _lp,
        address _lpAsset1,
        address _lpAsset2,
        string memory _lpName
    ) public onlyOwner {
        //create new oracles for this LP
        Oracle.createNewOracles(_lpAsset1, _lpAsset2, _lp);
        //create new Warp LP Vault
        address _WarpVault = WVLPF.createWarpVaultLP(_lp, _lpName);
        //track the warp vault lp instance by the address of the LP it represents
        instanceLPTracker[_lp] = _WarpVault;
        //add new LP Vault to the array of all LP vaults
        lpVaults.push(_WarpVault);
        //set Warp vault address as an approved vault
        isVault[_WarpVault] = true;
    }

    /**
    @notice createNewSCVault allows the contract owner to create a new WarpVaultLP contract for a specific LP token
    @param _baseRatePerYear is the base rate per year(approx target base APR)
    @param _multiplierPerYear is the multiplier per year(rate of increase in interest w/ utilizastion)
    @param _jumpMultiplierPerYear is the Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    @param _optimal is the this is the utilizastion point or "kink" at which the jump multiplier is applied
    @param _initialExchangeRate is the intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    @param _StableCoin is the address of the StableCoin this Warp Vault will manage
    **/
    function createNewSCVault(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate,
        address _StableCoin
    ) public onlyOwner {
        //create the interest rate model for this stablecoin
        address IR = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(this)
            )
        );
        //create the SC Warp vault
        address _WarpVault = WVSCF.createNewWarpVaultSC(
            IR,
            _StableCoin,
            _initialExchangeRate
        );
        //track the warp vault sc instance by the address of the stablecoin it represents
        instanceSCTracker[_StableCoin] = _WarpVault;
        //add new SC Vault to the array of all SC vaults
        scVaults.push(_WarpVault);
        //set Warp vault address as an approved vault
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

    function getTotalAvailableCollateralValue(address _account)
        public
        returns (uint256)
    {
        //get the number of LP vaults the platform has
        uint256 numVaults = lpVaults.length;
        //initialize the totalCollateral variable to zero
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

    function viewPriceOfCollateral(address lpToken) public view returns(uint256)
    {
        return Oracle.viewUnderlyingPrice(lpToken);
    }

    function viewPriceOfToken(address token) public view returns(uint256)
    {
        return Oracle.viewPriceOfToken(token);
    }

    function viewTotalBorrowedValue(address _account) public view returns (uint256) {
        uint256 numSCVaults = scVaults.length;
        //initialize the totalBorrowedValue variable to zero
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
        //return total Borrowed Value
        return totalBorrowedValue;
    }

    function getTotalBorrowedValue(address _account) public returns (uint256) {
        uint256 numSCVaults = scVaults.length;
        //initialize the totalBorrowedValue variable to zero
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
        //return total Borrowed Value
        return totalBorrowedValue;
    }

    /**
    @notice calcBorrowLimit is used to calculate the borrow limit for an account based on the input value of their collateral
    @param _collateralValue is the USDC value of the users collateral
    @dev this function divides the input value by 3 and then adds that value to itself so it can return 2/3rds of the availible collateral
        as the borrow limit. If a usser has $150 USDC value in collateral this function will return $100 USDC as their borrow limit.
    **/
    function calcBorrowLimit(uint256 _collateralValue)
        public
        view
        returns (uint256)
    {
        // We must do this math in terms of a single USDC
        uint256 oneUSDC = Oracle.OneUSDC();
        //divide the collaterals value by 3 to get 1/3rd of its value
        uint256 thirdCollatVal = _collateralValue.div(oneUSDC.mul(3));
        //add this 1/3rd value to itself to get 2/3rds of the original value
        return thirdCollatVal.add(thirdCollatVal);
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
        //return the users borrow limit
        return calcBorrowLimit(availibleCollateralValue);
    }

    /**
@notice borrowSC is the function an end user will call when they wish to borrow a stablecoin from the warp platform
@param _StableCoin is the address of the stablecoin the user wishes to borrow
@param _amount is the amount of that stablecoin the user wants to borrow
**/
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
        //call _borrow function on the stablecoin warp vault
        WV._borrow(_amount, msg.sender);
    }

    /**
      @notice markAccountNonCompliant is used by a potential liquidator to mark an account as non compliant which starts its 30 minute timer
      @param _borrower is the address of the non compliant borrower
      **/
    function markAccountNonCompliant(address _borrower) public {
        //needs to check for account compliance
        require(nonCompliant[_borrower] == 0);
        nonCompliant[_borrower] = now;
    }

    /**
@notice liquidateAccount is used to liquidate a non-compliant loan after it has reached its 30 minute grace period
@param _borrower is the address of the borrower whos loan is non-compliant
**/
    function liquidateAccount(address _borrower) public {
        //require the liquidator is not also the borrower
        require(msg.sender != _borrower);
        //require is has been a half hour since the loan was first seen to be non-compliant
        require(now >= nonCompliant[_borrower].add(1800));
        //retreive the number of stablecoin vaults in the warp platform
        uint256 numSCVaults = scVaults.length;
        //retreive the number of LP vaults in the warp platform
        uint256 numLPVaults = lpVaults.length;
        //initialize the borrowedAmount variable
        uint256 borrowedAmount = 0;
        //initialize the stable coin balances array
        uint256[] memory scBalances = new uint256[](numSCVaults);
        // loop through and retreive the Borrowed Amount From All Vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate the vault at the current  position in the array
            WarpVaultSCI scVault = WarpVaultSCI(scVaults[i]);
            //retreive the borrowers borrow balance from this vault and add it to the scBalances array
            scBalances[i] = scVault.borrowBalanceCurrent(_borrower);
            //add the borrowed amount to the total borrowed balance
            borrowedAmount = borrowedAmount.add(scBalances[i]);
        }
        //retreve the USDC borrow limit for the borrower
        uint256 borrowLimit = getBorrowLimit(_borrower);
        //check if the borrow is less than the borrowed amount
        if (borrowLimit <= borrowedAmount) {
            // If it is Liquidate the account
            //loop through each SC vault so the  Liquidator can pay off Stable Coin loans
            for (uint256 i = 0; i < numSCVaults; ++i) {
                //instantiate the Warp SC Vault at the current position
                WarpVaultSCI scVault = WarpVaultSCI(scVaults[i]);
                //call repayLiquidatedLoan function to repay the loan
                scVault._repayLiquidatedLoan(
                    _borrower,
                    msg.sender,
                    scBalances[i]
                );
            }
            //loop through each LP vault so the Liquidator gets the LP tokens the borrower had
            for (uint256 i = 0; i < numLPVaults; ++i) {
                //instantiate the Wapr LP Vault at the current position
                WarpVaultLPI lpVault = WarpVaultLPI(lpVaults[i]);
                //call liquidateAccount function on that LP vault
                lpVault._liquidateAccount(_borrower, msg.sender);
            }
        }
        //no matter what the compliance tracker for the borrowers account is reset
        nonCompliant[_borrower] = 0;
    }
}
