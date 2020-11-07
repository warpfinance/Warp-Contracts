import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { format } from "path";
import { getLogger } from "../util/logger";
import { formatBigNumber } from "../util/tools";

const contractABI = [
  'function USDC() public view returns (address)',
]

const logger = getLogger('Services::OracleFactory')

export class OracleFactoryService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;

    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(address, contractABI, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, contractABI, provider)
    }
  }

  USDC = async () => {
    return await this.contract.USDC();
  }

}