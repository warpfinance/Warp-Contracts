import { BigNumber, Contract, ethers, Wallet } from 'ethers';

const contractABI = [
  'function provideCollateral(uint256 _amount) public',
  'function withdrawCollateral(uint256 _amount) public',
  'function collateralOfAccount(address _account) public view returns (uint256)',
  'event CollateralProvided(address _account, uint256 _amount)',
  'event CollateralWithdraw(address _account, uint256 _amount)',
];

export class WarpLPVaultService {
  provider: any;
  contract: Contract;

  constructor(address: string, provider: any, signerAddress: Maybe<string>) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(address, contractABI, provider).connect(signer);
    } else {
      this.contract = new ethers.Contract(address, contractABI, provider);
    }
  }

  collateralBalance = async (account: string): Promise<BigNumber> => {
    return this.contract.collateralOfAccount(account);
  };
}
