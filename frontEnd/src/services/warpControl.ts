import { BigNumber, Contract, ethers, Wallet } from "ethers";

const warpControlABI:string [] = [
  'function instanceSCTracker(address _address) public view returns (address)',
  'function instanceLPTracker(address _address) public view returns (address)',
  'function viewPriceOfCollateral(address lpToken) public view returns(uint256)',
  'function viewPriceOfToken(address token) public view returns(uint256)'
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

}