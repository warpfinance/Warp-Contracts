import { Contract, Wallet, ethers, utils } from 'ethers'
import { providers, BigNumber } from 'ethers'

import { getLogger } from '../util/logger'
import { isAddress, isContract } from '../util/tools'
import { Token } from '../util/token'
import { createTransactionInfo, TransactionInfo } from '../util/types'



const logger = getLogger('Services::Erc20')

const erc20Abi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
]

export class ERC20Service {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, tokenAddress: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
    }
  }

  get address(): string {
    return this.contract.address
  }

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (owner: string, spender: string, neededAmount: BigNumber): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender)
    return allowance.gte(neededAmount)
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender)
  }

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = async (spender: string, amount: BigNumber): Promise<TransactionInfo> => {
    const transactionObject = await this.contract.approve(spender, amount, {
      value: '0x0',
    })
    logger.log(`Approve transaction hash: ${transactionObject.hash}`)

    return createTransactionInfo(this.provider, transactionObject);
  }

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited = async (spender: string): Promise<TransactionInfo> => {
    const transactionObject = await this.contract.approve(spender, ethers.constants.MaxUint256, {
      value: '0x0',
    })
    logger.log(`Approve unlimited transaction hash: ${transactionObject.hash}`)
    
    return createTransactionInfo(this.provider, transactionObject);
  }

  balanceOf = async (owner: string): Promise<BigNumber> => {
    return await this.contract.balanceOf(owner);
  }

  hasEnoughBalanceToFund = async (owner: string, amount: BigNumber): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner)

    return balance.gte(amount)
  }

  isValidErc20 = async (): Promise<boolean> => {
    try {
      if (!isAddress(this.contract.address)) {
        throw new Error('Is not a valid erc20 address')
      }

      if (!isContract(this.provider, this.contract.address)) {
        throw new Error('Is not a valid contract')
      }

      const [decimals, symbol] = await Promise.all([this.contract.decimals(), this.contract.symbol()])

      return !!(decimals && symbol)
    } catch (err) {
      logger.error(err.message)
      return false
    }
  }

  getProfileSummary = async (): Promise<Token> => {

    let decimals
    let symbol
    try {
      ;[decimals, symbol] = await Promise.all([this.contract.decimals(), this.contract.symbol()])
    } catch(e) {
      console.log(e);
      decimals = 18
      symbol = 'MKR'
    }

    return {
      address: this.contract.address,
      decimals,
      symbol,
    }
  }

  decimals = async (): Promise<number> => {
    return await this.contract.decimals();
  }
}
