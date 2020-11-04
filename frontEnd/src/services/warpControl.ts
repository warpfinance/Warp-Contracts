import { BigNumber, Contract, ethers, Wallet } from "ethers";

const warpControlABI = [
  'mapping(address => address) public instanceTracker',
  'function checkCollateralValue(address _borrower, address _WarpVault) external view  returns(uint)',
]

export class WarpControlService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, controlAddress: string) {
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
    return "";
  }

  getStableCoinVault = async (token: string): Promise<string> => {
    return "";
  }

}