import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { getLogger } from "../util/logger";
import { createTransactionInfo, TransactionInfo } from "../util/types";
import { OracleFactoryService } from "./oracleFactory";

const warpControlABI:string [] = [
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
  'function getGroupName(address _refferalCode) public view returns(string memory)'
]

const logger = getLogger('Services::WarpControlService')

export class WarpControlService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, controlAddress: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(controlAddress, warpControlABI, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(controlAddress, warpControlABI, provider)
    }
  }

  checkCollateralValue = async (borrower: string, vault: string): Promise<BigNumber> => {
    return await this.contract.checkCollateralValue(borrower, vault);
  }

  getLPVault = async (lpToken: string): Promise<string> => {
    return await this.contract.instanceLPTracker(lpToken);
  }

  getStableCoinVault = async (token: string): Promise<string> => {
    return await this.contract.instanceSCTracker(token);
  }

  getStableCoinPrice = async (stablecoin: string, amount?: BigNumber): Promise<BigNumber> => {
    if (!amount) {
      amount = BigNumber.from(0);
    }
    return await this.contract.viewPriceOfToken(stablecoin, amount);
  }

  getLPPrice = async (lpToken: string): Promise<BigNumber> => {
    return await this.contract.viewPriceOfCollateral(lpToken);
  }

  getBorrowAmount = async (account: string): Promise<BigNumber> => {
    return this.contract.viewTotalBorrowedValue(account);
  }

  getBorrowLimit = async (account: string): Promise<BigNumber> => {
    return this.contract.viewBorrowLimit(account);
  }

  // Returns value in USDC
  getTotalCollateralValue = async (account: string): Promise<BigNumber> => {
    return this.contract.viewTotalAvailableCollateralValue(account);
  }

  getMaxCollateralWithdrawAmount = async (account: string, lpToken: string): Promise<BigNumber> => {
    return this.contract.viewMaxWithdrawAllowed(account, lpToken);
  }

  borrowStableCoin = async (stableCoin: string, amount: BigNumber): Promise<TransactionInfo> => {
    const tx = await this.contract.borrowSC(stableCoin, amount);

    logger.log("borrowSC: " + tx.hash);
    
    return createTransactionInfo(this.provider, tx);
  }

  oracle = async (): Promise<string> => {
    return await this.contract.Oracle();
  }

  createTeam = async (teamName: string): Promise<TransactionInfo> => {
    const tx = await this.contract.createGroup(teamName);

    logger.log("Create Team Hash: " + tx.hash);

    return createTransactionInfo(this.provider, tx);
  }

  joinTeam = async (teamCode: string): Promise<TransactionInfo> => {
    const tx = await this.contract.addMemberToGroup(teamCode);

    logger.log("Join team hash: " + tx.hash);

    return createTransactionInfo(this.provider, tx);
  }

  hasJoinedTeam = async (account: string): Promise<boolean> => {
    return await this.contract.isInGroup(account);
  }

  getTeamCode = async (account: string): Promise<string> => {
    return await this.contract.groupsYourIn(account);
  }

  getTeamName = async (teamCode: string): Promise<string> => {
    return await this.contract.getGroupName(teamCode);
  }

  teamExists = async (teamCode: string): Promise<boolean> => {
    return await this.contract.existingRefferalCode(teamCode);
  }





}