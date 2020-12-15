import { Team } from '../../datapoints';
import { getLogger, TotalValueLocked } from '../util';
import { AccountScores } from './scoreAccounts';
import { convertTeamsToLookup, Teams } from './teamHelpers';

const logger = getLogger('Logic::scoreTeams');

export interface TeamScore {
  team: Team;
  tvl: TotalValueLocked;
}

export interface TeamScores {
  [teamCode: string]: TeamScore;
}

export const calculateTeamScores = (scores: AccountScores, teams: Teams) => {
  const teamScores: TeamScores = {};
  const userToTeam = convertTeamsToLookup(teams);
};
