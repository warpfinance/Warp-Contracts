import { WarpControlService } from '../contracts';
import { getLogger } from '../util';

export interface TeamMember {
  account: string;
}

export interface Team {
  members: TeamMember[];
  code: string;
  name: string;
}

export interface Teams {
  [code: string]: Team;
}

export interface AccountTeamLookup {
  [account: string]: Team;
}

const logger = getLogger(`logic::teamHelpers`);

export const getTeams = async (control: WarpControlService, debug?: boolean) => {
  const teamCodes = await control.getTeams();
  const teams: Teams = {};

  for (const code of teamCodes) {
    if (debug) {
      logger.debug(`Getting team data for team ${code}`);
    }

    const accounts = await control.getTeamMembers(code);
    const name = await control.getTeamName(code);

    const members = accounts.map(e => ({account: e}));

    teams[code] = {
      members,
      name,
      code,
    };
  }

  return teams;
};

export const convertTeamsToLookup = (teams: Teams): AccountTeamLookup => {
  const lookup: AccountTeamLookup = {};

  for (const team of Object.values(teams)) {
    for (const member of team.members) {
      lookup[member.account] = team;
    }
  }

  return lookup;
};
