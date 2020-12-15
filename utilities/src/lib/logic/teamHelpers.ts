import { WarpControlService } from '../contracts';
import { getLogger } from '../util';

export interface Team {
    members: string[];
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

export const getTeams = async (control: WarpControlService) => {
    const teamCodes = await control.getTeams();
    const teams: Teams = {};

    for (const code in teamCodes) {
        const members = await control.getTeamMembers(code);
        const name = await control.getTeamName(code);

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
            lookup[member] = team;
        }
    }

    return lookup;
};
