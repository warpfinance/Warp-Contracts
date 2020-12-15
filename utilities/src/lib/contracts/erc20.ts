import { Contract, Wallet, ethers } from 'ethers';
import { BigNumber } from 'ethers';

const erc20Abi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
];

export class ERC20Service {
  provider: any;
  contract: Contract;

  constructor(provider: any, signerAddress: Maybe<string>, tokenAddress: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (owner: string, spender: string, neededAmount: BigNumber): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender);
    return allowance.gte(neededAmount);
  };

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender);
  };

  balanceOf = async (owner: string): Promise<BigNumber> => {
    return await this.contract.balanceOf(owner);
  };

  hasEnoughBalanceToFund = async (owner: string, amount: BigNumber): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner);

    return balance.gte(amount);
  };

  decimals = async (): Promise<number> => {
    return await this.contract.decimals();
  };
}
