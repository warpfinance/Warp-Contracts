import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { getLogger } from "../util/logger";
import { nullAddress } from "../util/tools";
import { createTransactionInfo, TransactionInfo } from "../util/types";

const contractABI = [
  'function provideCollateral(uint256 _amount, address referralCode) public',
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

  provideCollateral = async (amount: BigNumber, referralCode: Maybe<string>): Promise<TransactionInfo> => {
    let code = nullAddress;
    if (referralCode) {
      if (!isAddress(referralCode)) {
        const errorMessage = "provideCollateral referral address invalid: " + referralCode
        logger.error(errorMessage);
        throw Error(errorMessage);
      }

      code = referralCode;
    }

    const tx = await this.contract.provideCollateral(amount, code);

    logger.log("provideCollateral: " + tx.hash);

    return createTransactionInfo(this.provider, tx);
  }

  withdrawCollateral = async (amount: BigNumber): Promise<TransactionInfo> => {
    const tx = await this.contract.withdrawCollateral(amount);

    logger.log("withdrawCollateral: " + tx.hash);

    return createTransactionInfo(this.provider, tx);
  }

  collateralBalance = async (account: string): Promise<BigNumber> => {
    return this.contract.collateralOfAccount(account);
  }

}