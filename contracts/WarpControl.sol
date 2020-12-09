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
    address public newWarpControl;
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

  /**
  @notice viewNumLPVaults returns the number of lp vaults on the warp platform
  **/
    function viewNumLPVaults() external view returns(uint256) {
        return lpVaults.length;
    }

  /**
  @notice viewNumSCVaults returns the number of stablecoin vaults on the warp platform
  **/
    function viewNumSCVaults() external view returns(uint256) {
        return scVaults.length;
    }

  /**
  @notice viewLaunchParticipants returns an array of all launch participant addresses
  **/
    function viewLaunchParticipants() public view returns(address[] memory) {
      return launchParticipants;
    }

  /**
  @notice viewAllGroups returns an array of all group addresses
  **/
    function viewAllGroups() public view returns(address[] memory) {
      return groups;
    }

  /**
  @notice viewAllMembersOfAGroup returns an array of addresses containing the addresses of every member in a group
  @param _refferalCode is the address that acts as a referral code for a group
  **/
    function viewAllMembersOfAGroup(address _refferalCode) public view returns(address[] memory) {
      return refferalCodeTracker[_refferalCode];
    }

  /**
  @notice getGroupName returns the name of a group
  @param _refferalCode is the address that acts as a referral code for a group
  **/
    function getGroupName(address _refferalCode) public view returns(string memory) {
      return refferalCodeToGroupName[_refferalCode];
    }

  /**
  @notice getAccountsGroup returns the refferal code address of the team an account is on
  @param _account is the address whos team is being retrieved
  **/
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

    /**
    @notice @createGroup is used to create a new group
    @param _groupName is the name of the group being created
    @dev the refferal code for this group is the address of the msg.sender
    **/
    function createGroup(string memory _groupName) public {
        require(isInGroup[msg.sender] == false, "Cant create a group once already in one");

        // Create group
        existingRefferalCode[msg.sender] = true;
        refferalCodeToGroupName[msg.sender] = _groupName;
        groups.push(msg.sender);

        // Join Group
        refferalCodeTracker[msg.sender].push(msg.sender);
        isInGroup[msg.sender] = true;
        groupsYourIn[msg.sender] = msg.sender;

        launchParticipants.push(msg.sender);
    }

    /**
    @notice addMemberToGroup is used to add an account to a group
    @param _refferalCode is the address used as a groups refferal code
    @dev the member being added is the msg.sender
    **/
    function addMemberToGroup(address _refferalCode) public {
        //Require a member is either not in a group OR has entered their groups refferal code
        require(isInGroup[msg.sender] == false, "Cant join more than one group");
        require(existingRefferalCode[_refferalCode] == true, "Group doesn't exist.");

        // Join Group
        refferalCodeTracker[_refferalCode].push(msg.sender);
        isInGroup[msg.sender] = true;
        groupsYourIn[msg.sender] = _refferalCode;

        launchParticipants.push(msg.sender);
    }




    /**
    @notice Figures out how much of a given LP token an account is allowed to withdraw
    @param account is the account being checked
    @param lpToken is the address of the lpToken the user wishes to withdraw
    @dev this function runs calculations to accrue interest for an up to date amount
     */
    function getMaxWithdrawAllowed(address account, address lpToken) public returns (uint256) {
        uint256 borrowedTotal = getTotalBorrowedValue(account);
        uint256 collateralValue = getTotalAvailableCollateralValue(account);
        uint256 requiredCollateral = calcCollateralRequired(borrowedTotal);
        uint256 leftoverCollateral = collateralValue.sub(requiredCollateral);
        uint256 lpValue = Oracle.getUnderlyingPrice(lpToken);
        return leftoverCollateral.mul(1e18).div(lpValue);
    }

    /**
    @notice Figures out how much of a given LP token an account is allowed to withdraw
    @param account is the account being checked
    @param lpToken is the address of the lpToken the user wishes to withdraw
    @dev this function does not run calculations to accrue interest and returns the previously calculated amount
     */
    function viewMaxWithdrawAllowed(address account, address lpToken) public view returns (uint256) {
        uint256 borrowedTotal = viewTotalBorrowedValue(account);
        uint256 collateralValue = viewTotalAvailableCollateralValue(account);
        uint256 requiredCollateral = calcCollateralRequired(borrowedTotal);
        uint256 leftoverCollateral = collateralValue.sub(requiredCollateral);
        uint256 lpValue = Oracle.viewUnderlyingPrice(lpToken);
        return leftoverCollateral.mul(1e18).div(lpValue);
    }

    /**
    @notice getTotalAvailableCollateralValue returns the total availible collaeral value for an account in USDC
    @param _account is the address whos collateral is being retreived
    @dev this function runs calculations to accrue interest for an up to date amount
    **/
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

    /**
    @notice getTotalAvailableCollateralValue returns the total availible collaeral value for an account in USDC
    @param _account is the address whos collateral is being retreived
    @dev this function does not run calculations to accrue interest and returns the previously calculated amount
    **/
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

    /**
    @notice viewPriceOfCollateral returns the price of an lpToken
    @param lpToken is the address of the lp token
    @dev this function runs calculations to retrieve the current price
    **/
    function viewPriceOfCollateral(address lpToken) public view returns(uint256)
    {
        return Oracle.viewUnderlyingPrice(lpToken);
    }

    /**
    @notice getPriceOfCollateral returns the price of an lpToken
    @param lpToken is the address of the lp token
    @dev this function does not run calculations amd returns the previously calculated price
    **/
    function getPriceOfCollateral(address lpToken) public returns(uint256)
    {
        return Oracle.getUnderlyingPrice(lpToken);
    }

    /**
    @notice viewPriceOfToken retrieves the price of a stablecoin
    @param token is the address of the stablecoin
    @param amount is the amount of stablecoin
    @dev this function runs calculations to retrieve the current price
    **/
    function viewPriceOfToken(address token, uint256 amount) public view returns(uint256)
    {
        return Oracle.viewPriceOfToken(token, amount);
    }

    /**
    @notice viewPriceOfToken retrieves the price of a stablecoin
    @param token is the address of the stablecoin
    @param amount is the amount of stablecoin
    @dev this function does not run calculations amd returns the previously calculated price
    **/
    function getPriceOfToken(address token, uint256 amount) public returns(uint256)
    {
        return Oracle.getPriceOfToken(token, amount);
    }

    /**
    @notice viewTotalBorrowedValue returns the total borrowed value for an account in USDC
    @param _account is the account whos borrowed value we are calculating
    @dev this function returns previously calculated values
    **/
    function viewTotalBorrowedValue(address _account) public view returns (uint256) {
        uint256 numSCVaults = scVaults.length;
        //initialize the totalBorrowedValue variable to zero
        uint256 totalBorrowedValue = 0;
        //loop through all stable coin vaults
        for (uint256 i = 0; i < numSCVaults; ++i) {
            //instantiate each LP warp vault
            WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            //retreive the amount user has borrowed from each stablecoin vault
            uint256 borrowBalanceInStable = WVSC.borrowBalancePrior(_account);
            if (borrowBalanceInStable == 0) {
                continue;
            }
            uint256 usdcBorrowedAmount = viewPriceOfToken(WVSC.getSCAddress(), borrowBalanceInStable);
            totalBorrowedValue = totalBorrowedValue.add(
                usdcBorrowedAmount
            );
        }
        //return total Borrowed Value
        return totalBorrowedValue;
    }

    /**
    @notice viewTotalBorrowedValue returns the total borrowed value for an account in USDC
    @param _account is the account whos borrowed value we are calculating
    @dev this function returns newly calculated values
    **/
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
            if (borrowBalanceInStable == 0) {
                continue;
            }
            uint256 usdcBorrowedAmount = getPriceOfToken(WVSC.getSCAddress(), borrowBalanceInStable);
            totalBorrowedValue = totalBorrowedValue.add(
                usdcBorrowedAmount
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

    /**
    @notice calcCollateralRequired returns the amount of collateral needed for an input borrow value
    @param _borrowAmount is the input borrow amount
    **/
    function calcCollateralRequired(uint256 _borrowAmount) public pure returns (uint256) {
        return _borrowAmount.mul(3).div(2);
    }

    /**
    @notice getBorrowLimit returns the borrow limit for an account
    @param _account is the input account address
    @dev this calculation uses current values for calculations
    **/
    function getBorrowLimit(address _account) public returns (uint256) {
        uint256 availibleCollateralValue = getTotalAvailableCollateralValue(
            _account
        );

        return calcBorrowLimit(availibleCollateralValue);
    }

    /**
    @notice getBorrowLimit returns the borrow limit for an account
    @param _account is the input account address
    @dev this calculation uses previous values for calculations
    **/
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
        uint256 borrowedTotalInUSDC = getTotalBorrowedValue(msg.sender);
        uint256 borrowLimitInUSDC = getBorrowLimit(msg.sender);
        uint256 borrowAmountAllowedInUSDC = borrowLimitInUSDC.sub(borrowedTotalInUSDC);

        uint256 borrowAmountInUSDC = getPriceOfToken(_StableCoin, _amount);

        //require the amount being borrowed is less than or equal to the amount they are aloud to borrow
        require(borrowAmountAllowedInUSDC >= borrowAmountInUSDC, "Borrowing more than allowed");
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
        require(msg.sender != _borrower, "you cant liquidate yourself");
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
            uint256 borrowedAmountInUSDC = viewPriceOfToken(getVaultByAsset[address(scVault)], scBalances[i]);

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

    /**
    @notice updateInterestRateModel allows the warp team to update the interest rate model for a stablecoin
    @param _token is the address of the stablecoin whos vault is having its interest rate updated
    @param _baseRatePerYear is the base rate per year(approx target base APR)
    @param _multiplierPerYear is the multiplier per year(rate of increase in interest w/ utilizastion)
    @param _jumpMultiplierPerYear is the Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    @param _optimal is the this is the utilizastion point or "kink" at which the jump multiplier is applied
    **/
    function updateInterestRateModel(
        address _token,
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal
      ) public onlyWarpT {
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

    /**
    @notice startUpgradeTimer starts a two day timer signaling that this contract will soon be updated to a new version
    @param _newWarpControl is the address of the new Warp control contract being upgraded to
    **/
    function startUpgradeTimer(address _newWarpControl) public onlyWarpT{
      newWarpControl = _newWarpControl;
      graceSpace = now.add(172800);
    }

    /**
    @notice upgradeWarp is used to upgrade the Warp platform to use a new version of the WarpControl contract
    **/
    function upgradeWarp() public onlyOwner {
      require(now >= graceSpace, "you cant ugrade yet, less than two days");
        uint256 numVaults = lpVaults.length;
        uint256 numSCVaults = scVaults.length;
      for (uint256 i = 0; i < numVaults; ++i) {
          WarpVaultLPI vault = WarpVaultLPI(lpVaults[i]);
          vault.upgrade(newWarpControl);
    }

      for (uint256 i = 0; i < numSCVaults; ++i) {
          //instantiate each LP warp vault
          WarpVaultSCI WVSC = WarpVaultSCI(scVaults[i]);
            WVSC.upgrade(newWarpControl);
        }
          WVLPF.transferOwnership(newWarpControl);
          WVSCF.transferOwnership(newWarpControl);
          Oracle.transferOwnership(newWarpControl);
  }

/**
@notice transferWarpTeam allows the wapr team address to be changed by the owner account
@param _newWarp is the address of the new warp team
**/
    function transferWarpTeam(address _newWarp) public onlyOwner {
      warpTeam = _newWarp;
    }
}
