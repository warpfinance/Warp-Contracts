import { BigNumber, Contract, ethers, Wallet } from "ethers";

const contractABI = [
  'mapping(address => address) public instanceTracker',
  'function checkCollateralValue(address _borrower, address _WarpVault) external view  returns(uint)',
]

export class WarpLPVaultService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, controlAddress: string) {
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(controlAddress, contractABI, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(controlAddress, contractABI, provider)
    }
  }

}