import { Contract, ethers, Wallet } from "ethers";
import { ERC20Service } from "./erc20"

const uniswapLPAbi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
]

export class UniswapLPToken extends ERC20Service {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, tokenAddress: string) {
    super(provider, signerAddress, tokenAddress);

    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(tokenAddress, uniswapLPAbi, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(tokenAddress, uniswapLPAbi, provider)
    }
    
  }

  token0 = async (): Promise<string> => {
    return this.contract.token0()
  }

  token1 = async (): Promise<string> => {
    return this.contract.token1()
  }

}