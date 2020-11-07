import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { getLogger } from "../util/logger";

const contractABI = [
  'function provideCollateral(uint256 _amount) public',
  'function withdrawCollateral(uint256 _amount) public',
  'function collateralOfAccount(address _account) public view returns (uint256)'
]

const logger = getLogger('Services::WarpLPVault')

export class WarpLPVaultService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, controlAddress: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(controlAddress, contractABI, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(controlAddress, contractABI, provider)
    }
  }

  provideCollateral = async (amount: BigNumber): Promise<void> => {
    const tx = await this.contract.provideCollateral(amount);

    logger.log("provideCollateral: " + tx.hash);

    return this.provider.waitForTransaction(tx.hash);
  }

  withdrawCollateral = async (amount: BigNumber): Promise<void> => {
    const tx = await this.contract.withdrawCollateral(amount);

    logger.log("withdrawCollateral: " + tx.hash);

    return this.provider.waitForTransaction(tx.hash);
  }

  collateralBalance = async (account: string): Promise<BigNumber> => {
    return this.contract.collateralOfAccount(account);
  }

}