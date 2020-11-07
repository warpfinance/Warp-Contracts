import { BigNumber, Contract, ethers, Wallet } from "ethers";

const contractABI = [
  'function borrowRatePerBlock() public view returns (uint256)',
  'function supplyRatePerBlock() public view returns (uint256)',
]

export class StableCoinWarpVaultService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
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


}