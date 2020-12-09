import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { format } from "path";
import { getLogger } from "../util/logger";
import { formatBigNumber, isAddress, nullAddress } from "../util/tools";
import { createTransactionInfo, TransactionInfo } from "../util/types";

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

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
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

  lendToVault = async (amount: BigNumber): Promise<TransactionInfo> => {
    const transactionObject = await this.contract.lendToWarpVault(amount, { gasLimit: 150000 });

    logger.log("lendToWarpVault: " + transactionObject.hash);
    
    return createTransactionInfo(this.provider, transactionObject);
  }

  getBalance = async (account: string): Promise<BigNumber> => {
    return await this.contract.viewAccountBalance(account);
  }

  // exchangeRate = async (): Promise<BigNumber> => {
  //   return await this.contract.exchangeRatePrior();
  // }
  
  withdraw = async (amount: BigNumber): Promise<TransactionInfo> => {

    const transactionObject = await this.contract.redeem(amount);

    logger.log("redeem: " + transactionObject.hash);
    
    return createTransactionInfo(this.provider, transactionObject);
  }

  borrowedAmount = async (account: string): Promise<BigNumber> => {
    return await this.contract.borrowBalancePrior(account);
  }

  repay = async (amount: BigNumber): Promise<TransactionInfo> => {
    const tx = await this.contract.repayBorrow(amount);
    logger.log("repay: " + tx.hash);

    return createTransactionInfo(this.provider, tx);
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