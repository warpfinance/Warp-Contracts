import { Contract, ethers, Wallet } from "ethers";
import { getLogger } from "../util/logger";
import { createTransactionInfo, TransactionInfo } from "../util/types";

const contractAbi: string[] = [
  'function claimNFTs() public',
  'function hasEpic(address _account) public view returns(bool)',
  'function hasLegendary(address _account) public view returns(bool)',
  'function hasRare(address _account) public view returns(bool)',
  'function hasSocial(address _account) public view returns(bool)',
  'function canClaim(address _account) public view returns(bool)',
]

const logger = getLogger('Services::WarpNFTService')

export class WarpLaunchNftService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(address, contractAbi, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, contractAbi, provider)
    }
  }

  claimNfts = async (): Promise<TransactionInfo> => {
    const tx = await this.contract.claimNFTs();
    logger.log("claimNFTs: " + tx.hash);
    
    return createTransactionInfo(this.provider, tx);
  }

  hasEpicNft = async (account: string): Promise<boolean> => {
    return await this.contract.hasEpic(account);
  }

  hasLegendaryNft = async (account: string): Promise<boolean> => {
    return await this.contract.hasLegendary(account);
  }

  hasRareNft = async (account: string): Promise<boolean> => {
    return await this.contract.hasRare(account);
  }

  hasSocialNft = async (account: string): Promise<boolean> => {
    return await this.contract.hasSocial(account);
  }

  canClaimNfts = async (account: string): Promise<boolean> => {
    return await this.contract.canClaim(account);
  }
}
