import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { getLogger } from "../util/logger";
import { globalCallArgs } from "./callHelper";

const contractABI = [
  'function borrowRatePerBlock() public view returns (uint256)',
  'function supplyRatePerBlock() public view returns (uint256)',
  'function lendToWarpVault(uint256 _amount) public',
  'function viewAccountBalance(address _account) public view returns (uint256)',
  'function exchangeRatePrior() public view returns (uint256)',
  'function redeem(uint256 _amount) public',
  'function borrowBalancePrior(address account) public view returns (uint256)',
  'function repayBorrow(uint256 repayAmount) public',
  'function viewHistoricalReward(address _account) public view returns (uint256)',
  'function getCash() external view returns (uint256)',
  `function totalBorrows() public view returns (uint256)`,
  `function getCashPrior() public view returns (uint256)`
]

const logger = getLogger('Services::StableCoinVault')

export class StableCoinWarpVaultService {
  provider: any
  contract: Contract

  constructor(address: string, provider: any, signerAddress: Maybe<string>) {
    this.provider = provider;

    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(address, contractABI, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, contractABI, provider);
    }
  }

  supplyRate = async (): Promise<BigNumber> => {
    return await this.contract.supplyRatePerBlock();
  }

  borrowRate = async (): Promise<BigNumber> => {
    return await this.contract.borrowRatePerBlock();
  }

  getBalance = async (account: string): Promise<BigNumber> => {
    const args = globalCallArgs();
    return await this.contract.viewAccountBalance(account, args);
  }

  borrowedAmount = async (account: string): Promise<BigNumber> => {
    return await this.contract.borrowBalancePrior(account);
  }

  getHistoricalReward = async (account: string): Promise<BigNumber> => {
    return await this.contract.viewHistoricalReward(account);
  }

  getAmountInVault = async (): Promise<BigNumber> => {
    return await this.contract.getCash();
  }
  
  getTotalAmountBorrowed = async (): Promise<BigNumber> => {
    return await this.contract.totalBorrows();
  }

  getCash = async (): Promise<BigNumber> => {
    return await this.contract.getCashPrior();
  }

}