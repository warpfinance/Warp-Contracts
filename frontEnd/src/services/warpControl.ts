import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { getLogger } from "../util/logger";
import { OracleFactoryService } from "./oracleFactory";

const warpControlABI:string [] = [
  'function instanceSCTracker(address _address) public view returns (address)',
  'function instanceLPTracker(address _address) public view returns (address)',
  'function viewPriceOfCollateral(address lpToken) public view returns(uint256)',
  'function viewPriceOfToken(address token) public view returns(uint256)',
  'function viewMaxWithdrawAllowed(address account, address lpToken) public view returns (uint256)',
  'function viewTotalAvailableCollateralValue(address _account) public view returns (uint256)',
  'function viewTotalBorrowedValue(address _account) public view returns (uint256)',
  'function viewBorrowLimit(address _account) public view returns (uint256)',
  'function borrowSC(address _StableCoin, uint256 _amount) public',
  'function Oracle() public view returns (address)'
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

  getStableCoinPrice = async (stablecoin: string): Promise<BigNumber> => {
    return await this.contract.viewPriceOfToken(stablecoin);
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

  borrowStableCoin = async (stableCoin: string, amount: BigNumber): Promise<void> => {
    const tx = await this.contract.borrowSC(stableCoin, amount);

    logger.log("borrowSC: " + tx.hash);
    
    return this.provider.waitForTransaction(tx.hash);
  }

  oracle = async (): Promise<string> => {
    return await this.contract.Oracle();
  }



}