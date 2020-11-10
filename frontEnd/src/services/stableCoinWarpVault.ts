import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { format } from "path";
import { getLogger } from "../util/logger";
import { formatBigNumber } from "../util/tools";

const contractABI = [
  'function borrowRatePerBlock() public view returns (uint256)',
  'function supplyRatePerBlock() public view returns (uint256)',
  'function lendToWarpVault(uint256 _amount) public',
  'function viewAccountBalance(address _account) public view returns (uint256)',
  'function exchangeRatePrior() public view returns (uint256)',
  'function redeem(uint256 _amount) public',
  'function borrowBalancePrior(address account) public view returns (uint256)',
  'function repayBorrow(uint256 repayAmount) public',
  'function viewHistoricalReward(address _account) public view returns (uint256)'
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
      this.contract = new ethers.Contract(address, contractABI, provider)
    }
  }

  supplyRate = async (): Promise<BigNumber> => {
    return await this.contract.supplyRatePerBlock();
  }

  borrowRate = async (): Promise<BigNumber> => {
    return await this.contract.borrowRatePerBlock();
  }

  lendToVault = async (amount: BigNumber): Promise<void> => {

    const transactionObject = await this.contract.lendToWarpVault(amount);

    logger.log("lendToWarpVault: " + transactionObject.hash);
    
    return this.provider.waitForTransaction(transactionObject.hash);
  }

  getBalance = async (account: string): Promise<BigNumber> => {
    return await this.contract.viewAccountBalance(account);
  }

  // exchangeRate = async (): Promise<BigNumber> => {
  //   return await this.contract.exchangeRatePrior();
  // }
  
  withdraw = async (amount: BigNumber): Promise<void> => {
    const rate = await this.contract.exchangeRatePrior();
    logger.log("Attempting to withdraw " + formatBigNumber(rate, 18) + " stable coins.");
    logger.log("Exchange Rate: " + formatBigNumber(rate, 18));
    const warpTokenAmount = amount.div(rate);
    logger.log("Withdrawing " + formatBigNumber(warpTokenAmount, 18) + " Warp Stable Coins");
    const transactionObject = await this.contract.redeem(warpTokenAmount);

    logger.log("redeem: " + transactionObject.hash);
    
    return this.provider.waitForTransaction(transactionObject.hash);
  }

  borrowedAmount = async (account: string): Promise<BigNumber> => {
    return await this.contract.borrowBalancePrior(account);
  }

  repay = async (amount: BigNumber): Promise<void> => {
    const tx = await this.contract.repayBorrow(amount);
    logger.log("repay: " + tx.hash);

    return this.provider.waitForTransaction(tx.hash);
  }

  getHistoricalReward = async (account: string): Promise<BigNumber> => {
    return await this.contract.viewHistoricalReward(account);
  }

}