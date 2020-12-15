import { BigNumber, Contract, Wallet } from 'ethers';
import { getLogger } from '../util/logger';
import { globalCallArgs } from './callHelper';

const warpControlABI: string[] = [
  'function instanceSCTracker(address _address) public view returns (address)',
  'function instanceLPTracker(address _address) public view returns (address)',
  'function viewPriceOfCollateral(address lpToken) public view returns(uint256)',
  'function viewPriceOfToken(address token, uint256 amount) public view returns(uint256)',
  'function viewMaxWithdrawAllowed(address account, address lpToken) public view returns (uint256)',
  'function viewTotalAvailableCollateralValue(address _account) public view returns (uint256)',
  'function viewTotalBorrowedValue(address _account) public view returns (uint256)',
  'function viewBorrowLimit(address _account) public view returns (uint256)',
  'function borrowSC(address _StableCoin, uint256 _amount) public',
  'function Oracle() public view returns (address)',
  'function createGroup(string memory _groupName) public',
  'function addMemberToGroup(address _refferalCode) public',
  'function groupsYourIn(address _account) public view returns (address)',
  'function isInGroup(address _account) public view returns (bool)',
  'function existingRefferalCode(address _team) public view returns (bool)',
  'function getGroupName(address _refferalCode) public view returns(string memory)',
  'function viewAllGroups() public view returns(address[] memory)',
  'function viewAllMembersOfAGroup(address _refferalCode) public view returns(address[] memory)',
  'function viewLaunchParticipants() public view returns(address[] memory)',
];

const logger = getLogger('Services::WarpControlService');

export class WarpControlService {
  provider: any;
  address: string;
  contract: Contract;

  constructor(address: string, provider: any, signerAddress: Maybe<string>) {
    this.address = address;
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new Contract(address, warpControlABI, provider).connect(signer);
    } else {
      this.contract = new Contract(address, warpControlABI, provider);
    }
  }

  checkCollateralValue = async (borrower: string, vault: string): Promise<BigNumber> => {
    return await this.contract.checkCollateralValue(borrower, vault);
  };

  getLPVault = async (lpToken: string): Promise<string> => {
    return await this.contract.instanceLPTracker(lpToken);
  };

  getStableCoinVault = async (token: string): Promise<string> => {
    return await this.contract.instanceSCTracker(token);
  };

  getStableCoinPrice = async (stablecoin: string, amount?: BigNumber): Promise<BigNumber> => {
    if (!amount) {
      amount = BigNumber.from(0);
    }
    return await this.contract.viewPriceOfToken(stablecoin, amount);
  };

  getLPPrice = async (lpToken: string): Promise<BigNumber> => {
    return await this.contract.viewPriceOfCollateral(lpToken);
  };

  getBorrowAmount = async (account: string): Promise<BigNumber> => {
    return this.contract.viewTotalBorrowedValue(account);
  };

  getBorrowLimit = async (account: string): Promise<BigNumber> => {
    return this.contract.viewBorrowLimit(account);
  };

  // Returns value in USDC
  getTotalCollateralValue = async (account: string): Promise<BigNumber> => {
    const args = globalCallArgs();
    return this.contract.viewTotalAvailableCollateralValue(account, args);
  };

  getMaxCollateralWithdrawAmount = async (account: string, lpToken: string): Promise<BigNumber> => {
    return this.contract.viewMaxWithdrawAllowed(account, lpToken);
  };

  hasJoinedTeam = async (account: string): Promise<boolean> => {
    return await this.contract.isInGroup(account);
  };

  getTeamCode = async (account: string): Promise<string> => {
    return await this.contract.groupsYourIn(account);
  };

  getTeamName = async (teamCode: string): Promise<string> => {
    return await this.contract.getGroupName(teamCode);
  };

  teamExists = async (teamCode: string): Promise<boolean> => {
    return await this.contract.existingRefferalCode(teamCode);
  };

  getTeams = async (): Promise<string[]> => {
    return await this.contract.viewAllGroups();
  };

  getTeamMembers = async (teamCode: string): Promise<string[]> => {
    return await this.contract.viewAllMembersOfAGroup(teamCode);
  };

  getLaunchParticipants = async (): Promise<string[]> => {
    return await this.contract.viewLaunchParticipants();
  };
}
