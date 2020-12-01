pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
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
    address public warpTeam;
    uint public graceSpace;

    address[] public lpVaults;
    address[] public scVaults;
    address[] public launchParticipants;
    address[] public groups;

    mapping(address => address) public instanceLPTracker; //maps LP token address to the assets WarpVault
    mapping(address => address) public instanceSCTracker;
    mapping(address => address) public getVaultByAsset;
    mapping(address => uint) public lockedLPValue;
    mapping(address => bool) public isVault;
    mapping(address => address[]) public refferalCodeTracker;
    mapping(address => string) public refferalCodeToGroupName;
    mapping(address => bool) public isParticipant;
    mapping(address => bool) public existingRefferalCode;
    mapping(address => bool) public isInGroup;
    mapping(address => address) public groupsYourIn;

    event NewLPVault(address _newVault);
    event NewSCVault(address _newVault, address _interestRateModel);
    event NewBorrow(address _borrower, address _StableCoin, uint _amountBorrowed);
    event NotCompliant(address _account, uint _time);
    event Liquidation(address _account, address liquidator);
    event complianceReset(address _account, uint _time);
    /**
      @dev Throws if called by any account other than a warp vault
     */
    modifier onlyVault() {
        require(isVault[msg.sender] == true);
        _;
    }

    /**
    @dev Throws if a function is called by anyone but the warp team
    **/
    modifier onlyWarpT() {
        require(msg.sender == warpTeam);
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
        address _WVSCF,
        address _warpTeam
    ) public {
        //instantiate the contracts
        Oracle = UniswapLPOracleFactoryI(_oracle);
        WVLPF = WarpVaultLPFactoryI(_WVLPF);
        WVSCF = WarpVaultSCFactoryI(_WVSCF);
        warpTeam = _warpTeam;
    }
///view functions for front end /////
    function viewNumLPVaults() external view returns(uint256) {
        return lpVaults.length;
    }

    function viewNumSCVaults() external view returns(uint256) {
        return scVaults.length;
    }

    function viewLaunchParticipants() public view returns(address[] memory) {
      return launchParticipants;
    }

    function viewAllGroups() public view returns(address[] memory) {
      return groups;
    }

    function viewAllMembersOfAGroup(address _refferalCode) public view returns(address[] memory) {
      return refferalCodeTracker[_refferalCode];
    }

    function getGroupName(address _refferalCode) public view returns(string memory) {
      return refferalCodeToGroupName[_refferalCode];
    }

    function getAccountsGroup(address _account) public view returns(address) {
      return groupsYourIn[_account];
    }


    /**
    @notice createNewLPVault allows the contract owner to create a new WarpVaultLP contract for a specific LP token
    @param _timelock is a variable representing the number of seconds the timeWizard will prevent withdraws and borrows from a contracts(one week is 605800 seconds)
    @param _lp is the address for the LP token this Warp Vault will manage
    @param _lpAsset1 is the address for the first asset in a pair that the LP token represents(ex: wETH in a wETH-wBTC uniswap pair)
    @param _lpAsset2 is the address for the second asset in a pair that the LP token represents(ex: wBTC in a wETH-wBTC uniswap pair)
    @param _lpName is the name of the LP token (ex:wETH-wBTC)
    **/
    function createNewLPVault(
        uint256 _timelock,
        address _lp,
        address _lpAsset1,
        address _lpAsset2,
        string memory _lpName
    ) public onlyOwner {
        //create new oracles for this LP
        Oracle.createNewOracles(_lpAsset1, _lpAsset2, _lp);
        //create new Warp LP Vault
        address _WarpVault = WVLPF.createWarpVaultLP(_timelock, _lp, _lpName);
        //track the warp vault lp instance by the address of the LP it represents
        instanceLPTracker[_lp] = _WarpVault;
        //add new LP Vault to the array of all LP vaults
        lpVaults.push(_WarpVault);
        //set Warp vault address as an approved vault
        isVault[_WarpVault] = true;
        //track vault to asset
        getVaultByAsset[_WarpVault] = _lp;
        emit NewLPVault(_WarpVault);
    }

    /**
    @notice createNewSCVault allows the contract owner to create a new WarpVaultLP contract for a specific LP token
    @param _timelock is a variable representing the number of seconds the timeWizard will prevent withdraws and borrows from a contracts(one week is 605800 seconds)
    @param _baseRatePerYear is the base rate per year(approx target base APR)
    @param _multiplierPerYear is the multiplier per year(rate of increase in interest w/ utilizastion)
    @param _jumpMultiplierPerYear is the Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    @param _optimal is the this is the utilizastion point or "kink" at which the jump multiplier is applied
    @param _initialExchangeRate is the intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    @param _StableCoin is the address of the StableCoin this Warp Vault will manage
    **/
    function createNewSCVault(
        uint256 _timelock,
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate,
        uint256 _reserveFactorMantissa,
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
            warpTeam,
            _initialExchangeRate,
            _timelock,
            _reserveFactorMantissa
        );
        //track the warp vault sc instance by the address of the stablecoin it represents
        instanceSCTracker[_StableCoin] = _WarpVault;
        //add new SC Vault to the array of all SC vaults
        scVaults.push(_WarpVault);
        //set Warp vault address as an approved vault
        isVault[_WarpVault] = true;
        //track vault to asset
        getVaultByAsset[_WarpVault] = _StableCoin;
        emit NewSCVault(_WarpVault, IR);
    }


    function createGroup(string memory _groupName) public {
      require(existingRefferalCode[msg.sender] == false);
        refferalCodeTracker[msg.sender].push(msg.sender);
          existingRefferalCode[msg.sender] = true;
          refferalCodeToGroupName[msg.sender] = _groupName;
          groups.push(msg.sender);
    }

    function addMemberToGroup(address _refferalCode, address _member) public onlyVault {
      //Require a member is either not in a group OR has entered their groups refferal code
      require(isInGroup[_member] == false || groupsYourIn[_member] == _refferalCode, "Cant join more than one group");
        refferalCodeTracker[_refferalCode].push(_member);
        isInGroup[_member] = true;
        groupsYourIn[_member] = _refferalCode;
            //add the mebers address to the total participants member array
      if(isParticipant[_member] == false) {
        launchParticipants.push(_member);
        isParticipant[_member] == true;
      }
    }




    /**
    @notice Figures out how much of a given LP token an account is allowed to withdraw
     */
    function getMaxWithdrawAllowed(address account, address lpToken) public returns (uint256) {
      //gets how much a user has borrowed against in USDC
        uint256 borrowedTotal = getTotalBorrowedValue(account);
      //gets the total USDC value of a users availible collateral
        uint256 collateralValue = getTotalAvailableCollateralValue(account);
      //determines usable collateral value
        uint256 usableCollateral = collateralValue.sub(borrowedTotal);
      //get current price of one LP token
        uint256 lpValue = Oracle.getUnderlyingPrice(lpToken);
      //return usable collateral value devided by the price of one lp token for maximum withdrawable lps(scale by 1e18)
        return usableCollateral.mul(1e18).div(lpValue);
    }

    function viewMaxWithdrawAllowed(address account, address lpToken) public view returns (uint256) {
        uint256 borrowedTotal = viewTotalBorrowedValue(account);
        uint256 collateralValue = viewTotalAvailableCollateralValue(account);
        uint256 usableCollateral = collateralValue.sub(borrowedTotal);
        uint256 lpValue = Oracle.viewUnderlyingPrice(lpToken);
        return usableCollateral.mul(1e18).div(lpValue);
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
        return totalCollateral.div(1e18);
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
        return totalCollateral.div(1e18);
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
                uint borrowBalanceInStable = WVSC.borrowBalancePrior(_account);
                uint8 decimals = WVSC.getSCDecimals();
                totalBorrowedValue = totalBorrowedValue.add(
                  borrowBalanceInStable
                ).div(
                  uint256(10) ** decimals
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
            uint borrowBalanceInStable = WVSC.borrowBalanceCurrent(_account);
            uint8 decimals = WVSC.getSCDecimals();
            totalBorrowedValue = totalBorrowedValue.add(
              borrowBalanceInStable
            ).div(
              uint256(10) ** decimals
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
        pure
        returns (uint256)
    {
        //divide the collaterals value by 3 to get 1/3rd of its value
        uint256 thirdCollatVal = _collateralValue.div(3);
        //add this 1/3rd value to itself to get 2/3rds of the original value
        return thirdCollatVal.add(thirdCollatVal);
    }

    function calcCollateralRequired(uint256 _borrowAmount) public view returns (uint256) {
        uint256 oneUSDC = Oracle.OneUSDC();
        uint256 factor = oneUSDC.div(calcBorrowLimit(oneUSDC));
        return _borrowAmount.mul(factor);
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
        emit NewBorrow(msg.sender, _StableCoin, _amount);
    }



    /**
@notice liquidateAccount is used to liquidate a non-compliant loan after it has reached its 30 minute grace period
@param _borrower is the address of the borrower whos loan is non-compliant
**/
    function liquidateAccount(address _borrower) public {
        //require the liquidator is not also the borrower
        require(msg.sender != _borrower);
        //retreive the number of stablecoin vaults in the warp platform
        uint256 numSCVaults = scVaults.length;
        //retreive the number of LP vaults in the warp platform
        uint256 numLPVaults = lpVaults.length;
        // This is how much USDC worth of Stablecoin the user has borrowed
        uint256 borrowedAmount = 0;
        //initialize the stable coin balances array
        uint256[] memory scBalances = new uint256[](numSCVaults);
        // loop through and retreive the Borrowed Amount From All Vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate the vault at the current  position in the array
            WarpVaultSCI scVault = WarpVaultSCI(scVaults[i]);
            //retreive the borrowers borrow balance from this vault and add it to the scBalances array
            scBalances[i] = scVault.borrowBalanceCurrent(_borrower);
            uint8 tokenDecimals = scVault.getSCDecimals();
            uint256 priceOfTokenInUSDC = viewPriceOfToken(getVaultByAsset[address(scVault)]);

            uint256 borrowedAmountInUSDC = (priceOfTokenInUSDC.mul(scBalances[i])).div(uint256(10) ** tokenDecimals);

            //add the borrowed amount to the total borrowed balance
            borrowedAmount = borrowedAmount.add(borrowedAmountInUSDC);
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
                //instantiate the Warp LP Vault at the current position
                WarpVaultLPI lpVault = WarpVaultLPI(lpVaults[i]);
                //call liquidateAccount function on that LP vault
                lpVault._liquidateAccount(_borrower, msg.sender);
            }
            emit Liquidation(_borrower, msg.sender);
        }
    }

    function updateInterestRateModel(
        address _token,
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal
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
      address vault = instanceSCTracker[_token];
      WarpVaultSCI WV = WarpVaultSCI(vault);
      WV.setNewInterestModel(IR);
    }

    function startUpgradeTimer() public onlyWarpT{
      graceSpace = now.add(172800);
    }

    function upgradeWarp(address _newWarpControl) public onlyWarpT {
      require(now >= graceSpace);
        uint256 numVaults = lpVaults.length;
        uint256 numSCVaults = scVaults.length;
      for (uint256 i = 0; i < numVaults; ++i) {
          WarpVaultLPI vault = WarpVaultLPI(lpVaults[i]);
          vault.transferOwnership(_newWarpControl);
    }

      for (uint256 i = 0; i < numSCVaults; ++i) {
          //instantiate each LP warp vault
          WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            WVSC.transferOwnership(_newWarpControl);
        }
          WVLPF.transferOwnership(_newWarpControl);
          WVSCF.transferOwnership(_newWarpControl);
          Oracle.transferOwnership(_newWarpControl);
  }
}
