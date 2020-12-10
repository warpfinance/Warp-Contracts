import { ERC20Service } from "../services/erc20";
import { StableCoinWarpVaultService } from "../services/stableCoinWarpVault";
import { WarpControlService } from "../services/warpControl";
import { getLogger } from "./logger";
import { getContractAddress, getTokensByNetwork } from "./networks";
import { Token } from "./token";
import { parseBigNumber } from "./tools";

const logger = getLogger("Utils::calculateTeamMetrics");


export interface TeamMember {
  address: string;
  tvl: string;
  lp: string;
  sc: string;
}

export interface Team {
  name: string;
  code: string;
  tvl: string;
  lp: string;
  sc: string;
  numMembers: number;
  members: TeamMember[];
}

export interface TeamMetrics {
  teams: Team[];
  timestamp: Date
}

export const calculateTeamMetrics = async (provider: any, networkId: number): Promise<TeamMetrics> => {
  const defaultTokens = getTokensByNetwork(networkId, false);

  const allTokens = getTokensByNetwork(networkId, false);
  const usdcToken = allTokens.find((t: Token) => {
    return t.symbol === "USDC";
  });
  if (!usdcToken) {
    logger.error("no USDC token registered");
    throw Error();
  }

  

  const controlAddress = getContractAddress(networkId, 'warpControl');
  const control = new WarpControlService(provider, null, controlAddress);

  interface StableCoinVault {
    service: StableCoinWarpVaultService;
    conversion: number;
    token: Token;
    decimals: number;
  }
  const scVaults: StableCoinVault[] = [];

  for (const token of defaultTokens) {
    const erc20Service = new ERC20Service(provider, null, token.address);
    const decimals = await erc20Service.decimals();
    const vaultAddress = await control.getStableCoinVault(token.address);
    const usdcPriceOfToken = parseBigNumber(await control.getStableCoinPrice(token.address), usdcToken.decimals);

    scVaults.push({
      service: new StableCoinWarpVaultService(provider, null, vaultAddress),
      conversion: usdcPriceOfToken,
      token: token,
      decimals
    })
  }

  const teamCodes = await control.getTeams();

  const calculatedTeams: Team[] = [];
  for (const code of teamCodes) {
    const name = await control.getTeamName(code);
    const members = await control.getTeamMembers(code);
    const memberData: TeamMember[] = [];

    let teamSCTVL = 0;
    let teamLPTVL = 0;

    logger.log(`Calculating TVL for team ${name} (${code})`);

    for (const member of members) {
      let memberSCTVL = 0;
      let memberLPTVL = 0;

      // Calculate TVL from Stablecoins
      for (const vault of scVaults) {
        const numTokens = parseBigNumber(await vault.service.getBalance(member), vault.decimals);
        const valueOfTokens = numTokens * vault.conversion;

        //logger.log(`${member} has ${numTokens} or $${valueOfTokens.toFixed(2)} worth of ${vault.token.symbol}`);

        memberSCTVL += valueOfTokens;
      }

      // Calculate TVL from LP
      const value = parseBigNumber(await control.getTotalCollateralValue(member), usdcToken.decimals);
      
      //logger.log(`${member} has $${value.toFixed(2)} worth of locked LP`);

      memberLPTVL += value;

      const memberTVL = (memberSCTVL + memberLPTVL).toFixed(2);
      logger.log(`${member} has $${memberTVL} of TVL`);

      memberData.push({
        address: member,
        tvl: memberTVL,
        sc: memberSCTVL.toFixed(2),
        lp: memberLPTVL.toFixed(2)
      })

      teamSCTVL += memberSCTVL;
      teamLPTVL += memberLPTVL;
    }

    memberData.sort((a: TeamMember, b: TeamMember) => {
      return parseFloat(b.tvl) - parseFloat(a.tvl);
    });

    calculatedTeams.push({
      name,
      code,
      numMembers: members.length,
      members: memberData,
      tvl: (teamSCTVL + teamLPTVL).toFixed(2),
      lp: teamLPTVL.toFixed(2),
      sc: teamSCTVL.toFixed(2)
    } as Team)
  }

  calculatedTeams.sort((a: Team, b: Team) => {
    return parseFloat(b.tvl) - parseFloat(a.tvl);
  });

  return {
    teams: calculatedTeams,
    timestamp: new Date()
  }
}